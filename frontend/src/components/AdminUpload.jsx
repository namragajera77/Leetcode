import { useParams, NavLink } from 'react-router';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient';
import { AlertCircle, ArrowLeft, CheckCircle, Trash2, Upload, Video, X } from 'lucide-react';

function AdminUpload() {
  const { problemId } = useParams();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [canceling, setCanceling] = useState(false);
  const abortControllerRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    setValue,
  } = useForm();

  const selectedFile = watch('videoFile')?.[0];

  React.useEffect(() => {
    if (selectedFile && uploadedVideo) setUploadedVideo(null);
  }, [selectedFile, uploadedVideo]);

  const handleCancelFile = () => {
    setValue('videoFile', null);
    reset();
    clearErrors();
    setUploadedVideo(null);
  };

  const handleCancelUpload = () => {
    if (!abortControllerRef.current) return;
    setCanceling(true);
    abortControllerRef.current.abort();
    setTimeout(() => {
      setUploading(false);
      setUploadProgress(0);
      setCanceling(false);
      abortControllerRef.current = null;
      clearErrors();
    }, 1000);
  };

  const onSubmit = async (data) => {
    const file = data.videoFile[0];
    setUploading(true);
    setUploadProgress(0);
    setCanceling(false);
    clearErrors();
    abortControllerRef.current = new AbortController();

    try {
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`, {
        signal: abortControllerRef.current.signal,
      });
      const { signature, timestamp, public_id, api_key, upload_url } = signatureResponse.data;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('api_key', api_key);

      const uploadResponse = await axios.post(upload_url, formData, {
        signal: abortControllerRef.current.signal,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;
      const metadataResponse = await axiosClient.post('/video/save', {
        problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      }, {
        signal: abortControllerRef.current.signal,
      });

      setUploadedVideo(metadataResponse.data.videoSolution);
      reset();
    } catch (err) {
      if (err.name === 'CanceledError' || err.message === 'canceled') return;
      console.error('Upload error:', err);
      setError('root', {
        type: 'manual',
        message: err.response?.data?.error || err.response?.data?.message || err.message || 'Upload failed. Please try again.',
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setCanceling(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <main className="app-shell flex min-h-screen items-center justify-center px-5 py-10">
      <section className="w-full max-w-xl">
        <NavLink to="/admin/video" className="btn-secondary-premium mb-5 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-black">
          <ArrowLeft className="h-4 w-4" />
          Video Management
        </NavLink>

        <div className="surface-strong rounded-lg p-6 lg:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
              <Video className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-black text-white">Upload Video</h1>
            <p className="mt-2 text-sm font-semibold text-slate-400">Attach a solution video to problem {problemId}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-200">Choose video file</label>
              <input
                type="file"
                accept="video/*"
                {...register('videoFile', {
                  required: 'Please select a video file',
                  validate: {
                    isVideo: (files) => {
                      if (!files || !files[0]) return 'Please select a video file';
                      return files[0].type.startsWith('video/') || 'Please select a valid video file';
                    },
                    fileSize: (files) => {
                      if (!files || !files[0]) return true;
                      return files[0].size <= 100 * 1024 * 1024 || 'File size must be less than 100MB';
                    },
                  },
                })}
                className="file-input w-full rounded-lg border border-slate-700 bg-slate-950 text-slate-200 file:bg-slate-800 file:text-slate-200"
                disabled={uploading}
              />
              {errors.videoFile && <p className="mt-2 text-sm text-red-300">{errors.videoFile.message}</p>}
            </div>

            {selectedFile && (
              <div className="rounded-lg border border-cyan-400/25 bg-cyan-400/10 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-black text-cyan-200">Selected File</h3>
                    <p className="mt-1 text-sm text-slate-200">{selectedFile.name}</p>
                    <p className="text-sm text-slate-400">Size: {formatFileSize(selectedFile.size)}</p>
                  </div>
                  {!uploading && (
                    <button type="button" onClick={handleCancelFile} className="rounded-lg border border-red-400/25 bg-red-400/10 p-2 text-red-300 hover:bg-red-400/15" title="Remove selected file">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {uploading && (
              <div className="rounded-lg border border-amber-400/25 bg-amber-400/10 p-4">
                <div className="mb-2 flex justify-between text-sm font-black text-amber-200">
                  <span>{canceling ? 'Canceling...' : 'Uploading...'}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className={`h-full rounded-full transition-all ${canceling ? 'bg-red-400' : 'accent-gradient'}`} style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}

            {errors.root && (
              <div className="flex items-center gap-2 rounded-lg border border-red-400/25 bg-red-400/10 p-4 text-sm font-bold text-red-200">
                <AlertCircle className="h-4 w-4" />
                {errors.root.message}
              </div>
            )}

            {uploadedVideo && (
              <div className="flex gap-3 rounded-lg border border-emerald-400/25 bg-emerald-400/10 p-4 text-emerald-100">
                <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-300" />
                <div>
                  <h3 className="font-black text-emerald-200">Upload Successful</h3>
                  <p className="text-sm">Duration: {formatDuration(uploadedVideo.duration)}</p>
                  <p className="text-sm">Uploaded: {new Date(uploadedVideo.uploadedAt).toLocaleString()}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
              {(uploading || (selectedFile && !uploading)) && (
                <button type="button" onClick={uploading ? handleCancelUpload : handleCancelFile} disabled={canceling} className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/25 bg-red-400/10 px-5 py-3 font-black text-red-300 transition hover:bg-red-400/15 disabled:opacity-50">
                  {uploading ? <X className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                  {canceling ? 'Canceling...' : uploading ? 'Cancel Upload' : 'Cancel'}
                </button>
              )}

              <button type="submit" disabled={uploading || !selectedFile} className="btn-primary-premium inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-black disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto">
                <Upload className="h-4 w-4" />
                {uploading ? 'Uploading...' : 'Upload Video'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default AdminUpload;
