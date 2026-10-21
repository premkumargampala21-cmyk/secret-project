import React, { useState, useEffect, useRef } from 'react';
import { Camera, ImagePlus, Trash2, Heart, X, ZoomIn, ChevronRight, Loader2, CloudUpload, AlertCircle, RefreshCw, CheckCircle2, Pencil, Sparkles } from 'lucide-react';
import { fireHeartBurst } from '../utils/confetti';

interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  date?: string;
  isCustom?: boolean;
}

interface MemoriesSectionProps {
  onContinue: () => void;
  authToken: string;
}

export const MemoriesSection: React.FC<MemoriesSectionProps> = ({ onContinue, authToken }) => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);

  // Edit Caption State
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editDate, setEditDate] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch photos from server
  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/photos', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to load shared memories');
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.photos)) {
        setPhotos(data.photos);
      }
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError('Could not load shared photos. Tap retry to reload.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [authToken]);

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input
    e.target.value = '';

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a JPG, PNG, or WebP image file ❤️');
      return;
    }

    // Size limit: 15MB
    if (file.size > 15 * 1024 * 1024) {
      setError('Image is too large. Please select a photo under 15MB.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccessMessage(null);
    setUploadProgress(20);
    setUploadProgressText('Optimizing photo for our album...');

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setUploadProgress(60);
      setUploadProgressText('Uploading to our shared cloud gallery... ☁️✨');

      try {
        const res = await fetch('/api/photos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            imageBase64: base64,
            caption: 'Our unforgettable moment together ❤️',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          }),
        });

        const data = await res.json();
        setUploadProgress(100);

        if (res.ok && data.success && data.photo) {
          setPhotos((prev) => [data.photo, ...prev]);
          setSuccessMessage('Photo successfully saved to our shared album! 💖');
          fireHeartBurst();

          setTimeout(() => {
            setSuccessMessage(null);
          }, 4000);
        } else {
          setError(data.message || 'Failed to upload photo. Please try again.');
        }
      } catch (err) {
        console.error('Upload failed:', err);
        setError('Network error uploading photo. Please try again.');
      } finally {
        setUploading(false);
        setUploadProgress(0);
        setUploadProgressText('');
      }
    };

    reader.onerror = () => {
      setUploading(false);
      setError('Could not read image file.');
    };

    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this shared photo? ❤️')) {
      return;
    }

    try {
      const res = await fetch(`/api/photos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
        if (activePhoto?.id === id) {
          setActivePhoto(null);
        }
        setSuccessMessage('Photo deleted successfully.');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('Could not delete photo. Please try again.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Network error deleting photo.');
    }
  };

  const handleOpenEdit = (photo: PhotoItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingPhoto(photo);
    setEditCaption(photo.caption || '');
    setEditDate(photo.date || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    setSavingEdit(true);
    try {
      const res = await fetch(`/api/photos/${editingPhoto.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          caption: editCaption,
          date: editDate,
        }),
      });

      if (res.ok) {
        setPhotos((prev) =>
          prev.map((p) =>
            p.id === editingPhoto.id
              ? { ...p, caption: editCaption, date: editDate }
              : p
          )
        );
        if (activePhoto?.id === editingPhoto.id) {
          setActivePhoto({ ...activePhoto, caption: editCaption, date: editDate });
        }
        setEditingPhoto(null);
        setSuccessMessage('Memory text updated successfully! ❤️');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('Failed to update memory text. Please try again.');
      }
    } catch (err) {
      console.error('Save edit error:', err);
      setError('Network error saving changes.');
    } finally {
      setSavingEdit(false);
    }
  };

  // Polaroid tilt rotations
  const rotations = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', '-rotate-3', 'rotate-3'];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 flex flex-col items-center">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-400/25 text-rose-200 text-xs font-medium mb-3">
          <Camera className="w-3.5 h-3.5 text-rose-300" />
          <span>Shared Cloud Gallery</span>
        </div>
        <h2 className="font-serif-romantic text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-md">
          OUR SPECIAL MEMORIES 📸
        </h2>
        <p className="font-serif-romantic text-sm sm:text-base text-rose-200/90 mt-2 max-w-lg mx-auto">
          Every photo is a treasure of our love, synced across all our phones and devices.
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full mx-auto mt-4" />
      </div>

      {/* Action Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8 px-2">
        <span className="text-xs text-rose-300/80 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>Cloud Synced ({photos.length} Memories)</span>
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchPhotos}
            disabled={loading}
            className="p-2 rounded-full text-rose-300 hover:text-white glass-panel border border-rose-400/20 transition cursor-pointer"
            title="Refresh shared gallery"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Requested Button: Upload Our Photos ❤️ */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="glass-button flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <ImagePlus className="w-4 h-4 text-white" />
                <span>Upload Our Photos ❤️</span>
              </>
            )}
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={handleUploadPhoto}
          className="hidden"
        />
      </div>

      {/* Uploading Progress Bar */}
      {uploading && (
        <div className="w-full max-w-md mx-auto mb-6 p-4 rounded-2xl glass-panel border border-rose-400/40 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between text-xs text-rose-100 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <CloudUpload className="w-4 h-4 text-rose-300 animate-bounce" />
              <span>{uploadProgressText}</span>
            </span>
            <span className="font-bold text-rose-300">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden border border-rose-400/20">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-300 transition-all duration-300 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="w-full max-w-md mx-auto mb-6 p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="w-full max-w-md mx-auto mb-6 p-3 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchPhotos}
            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-white font-medium text-[11px] transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-rose-300">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-rose-400" />
          <p className="font-serif-romantic text-sm text-rose-200">
            Loading our shared memories from cloud... ❤️
          </p>
        </div>
      ) : photos.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 glass-panel rounded-3xl border border-rose-400/20 max-w-md mx-auto text-center my-6 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-300 mb-3 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
            <Camera className="w-8 h-8" />
          </div>
          <h3 className="font-serif-romantic text-xl font-bold text-white mb-2">Our Album Awaits ❤️</h3>
          <p className="text-xs sm:text-sm text-rose-200/80 mb-5 leading-relaxed">
            No photos have been uploaded yet. Tap <strong>"Upload Our Photos ❤️"</strong> above to upload pictures from your phone or computer that we will both cherish!
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="glass-button px-6 py-2.5 rounded-full text-xs font-bold text-white flex items-center gap-2 cursor-pointer"
          >
            <ImagePlus className="w-4 h-4" />
            <span>Add Our First Photo</span>
          </button>
        </div>
      ) : (
        /* Polaroid Gallery Grid (2 rows of 3 on desktop) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className={`group relative bg-white/95 rounded-xl p-3 pb-5 shadow-2xl transition-all duration-300 hover:scale-105 hover:z-20 cursor-pointer ${
                rotations[idx % rotations.length]
              } border border-rose-200/50`}
            >
              {/* Washi tape accent on top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-rose-200/60 backdrop-blur-sm border-t border-b border-rose-300/40 rounded-xs shadow-sm transform -rotate-1 pointer-events-none" />

              {/* Photo frame */}
              <div className="w-full aspect-square rounded-md overflow-hidden bg-gradient-to-br from-rose-950/80 via-purple-950/80 to-stone-900 flex items-center justify-center relative">
                {photo.url ? (
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-3 text-rose-200">
                    <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center mb-2 text-rose-300 group-hover:scale-110 transition-transform">
                      <Heart className="w-6 h-6 fill-rose-500/40 text-rose-400 animate-pulse" />
                    </div>
                    <span className="font-script text-base text-rose-200 leading-tight">
                      {photo.date || 'Our Memory'}
                    </span>
                    <span className="text-[10px] text-rose-300/60 mt-1">Tap to enlarge</span>
                  </div>
                )}

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>

                {/* Top Action Buttons (Edit & Delete) */}
                <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                  <button
                    onClick={(e) => handleOpenEdit(photo, e)}
                    className="p-1.5 rounded-full bg-black/60 text-rose-200 hover:text-white hover:bg-rose-600 transition cursor-pointer shadow-md"
                    title="Edit caption and text"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  {photo.isCustom && (
                    <button
                      onClick={(e) => handleDeletePhoto(photo.id, e)}
                      className="p-1.5 rounded-full bg-black/60 text-rose-300 hover:text-white hover:bg-rose-600 transition cursor-pointer shadow-md"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Polaroid handwritten caption */}
              <div className="mt-3 text-center px-1">
                <div className="flex items-center justify-center gap-1.5">
                  <p className="font-script text-sm sm:text-base text-stone-800 font-bold leading-tight line-clamp-2">
                    {photo.caption}
                  </p>
                  <button
                    onClick={(e) => handleOpenEdit(photo, e)}
                    className="text-stone-400 hover:text-rose-600 p-0.5 transition cursor-pointer shrink-0"
                    title="Change this text"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
                {photo.date && (
                  <span className="text-[10px] text-stone-500 block mt-0.5 tracking-wider uppercase">
                    {photo.date}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal for Enlarged View */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative glass-panel rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-rose-400/40 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-rose-600 text-rose-200 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image container */}
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-rose-950 via-purple-950 to-black flex items-center justify-center mb-5 border border-rose-400/20">
              {activePhoto.url ? (
                <img
                  src={activePhoto.url}
                  alt={activePhoto.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mb-3">
                    <Heart className="w-8 h-8 fill-rose-500 text-rose-400 animate-pulse" />
                  </div>
                  <span className="font-serif-romantic text-xl text-rose-100 font-bold mb-1">
                    {activePhoto.caption}
                  </span>
                  <p className="text-xs text-rose-300/80 max-w-xs mt-1">
                    Upload any real photo using the "Upload Our Photos ❤️" button!
                  </p>
                </div>
              )}
            </div>

            {/* Caption & Date with Edit Button */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <h3 className="font-serif-romantic text-xl sm:text-2xl font-bold text-white">
                  {activePhoto.caption}
                </h3>
                <button
                  onClick={() => handleOpenEdit(activePhoto)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-rose-500/30 text-rose-300 hover:text-white transition cursor-pointer"
                  title="Edit text"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>

              {activePhoto.date && (
                <span className="inline-block px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 text-xs font-medium">
                  {activePhoto.date}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Matter Modal */}
      {editingPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setEditingPhoto(null)}
        >
          <div
            className="relative glass-panel rounded-3xl p-6 sm:p-8 max-w-md w-full border border-rose-400/40 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-rose-500/20">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="font-serif-romantic text-lg sm:text-xl font-bold text-white">
                  Change Memory Text ❤️
                </h3>
              </div>
              <button
                onClick={() => setEditingPhoto(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-rose-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-rose-200 mb-1.5">
                  Caption / Matter:
                </label>
                <textarea
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  placeholder="Enter custom matter for this frame..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-rose-400/30 text-white placeholder-rose-300/40 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-200 mb-1.5">
                  Date / Subtitle:
                </label>
                <input
                  type="text"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  placeholder="e.g. January 23 or Precious Moments"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-rose-400/30 text-white placeholder-rose-300/40 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
                  className="px-4 py-2 rounded-xl text-xs text-rose-300 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="glass-button px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {savingEdit ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes ❤️</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Navigation to next section */}
      <div className="mt-4">
        <button
          onClick={onContinue}
          className="glass-button px-8 py-3.5 rounded-full text-sm sm:text-base font-semibold text-white flex items-center gap-2.5 shadow-xl transition-all cursor-pointer"
        >
          <span>THINGS I NEVER TOLD YOU 💌</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
