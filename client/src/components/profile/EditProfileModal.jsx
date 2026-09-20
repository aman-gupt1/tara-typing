import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Camera, Loader2, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import UserAvatar, { isDefaultOrEmptyAvatar } from '../common/UserAvatar';

export const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const shouldReduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    location: user?.location || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDiscardPrompt, setShowDiscardPrompt] = useState(false);
  const fileInputRef = useRef(null);
  const initialDataRef = useRef({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    location: user?.location || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });

  useEffect(() => {
    if (user) {
      const data = {
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        location: user.location || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
      };
      setFormData(data);
      initialDataRef.current = data;
      setErrors({});
      setShowDiscardPrompt(false);
    }
  }, [user, isOpen]);

  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialDataRef.current);

  const handleCloseAttempt = () => {
    if (loading) return;
    if (isDirty) {
      setShowDiscardPrompt(true);
    } else {
      onClose();
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please enter your full name';
    if (!formData.username.trim()) {
      errs.username = 'Please enter a username';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
      errs.username = 'Use only letters, numbers, and underscores';
    }
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (formData.bio.length > 160) {
      errs.bio = 'Bio must be 160 characters or fewer';
    }
    return errs;
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, avatar: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        await onSave({
          ...formData,
          name: formData.name.trim(),
          username: formData.username.trim(),
          email: formData.email.trim(),
          location: (formData.location || '').trim(),
          bio: formData.bio.trim(),
        });
        onClose();
      } catch (err) {
        toast.error('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const inputClass =
    'w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30';

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="presentation"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.05 : 0.2, ease: 'easeOut' }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={handleCloseAttempt}
          />

          {/* Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 4 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -2 }}
            transition={{
              duration: shouldReduceMotion ? 0.05 : 0.2,
              exit: { duration: shouldReduceMotion ? 0.05 : 0.14, ease: 'easeIn' },
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative z-10 max-h-[min(760px,calc(100vh-3rem))] w-full max-w-[540px] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl shadow-primary/20"
            onClick={(e) => e.stopPropagation()}
          >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
          <div>
            <h2 id="edit-profile-title" className="font-display text-lg font-bold text-foreground">
              Edit Profile
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Keep your profile details up to date.</p>
          </div>
          <button
            type="button"
            onClick={handleCloseAttempt}
            aria-label="Close edit profile"
            className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <X size={18} />
          </button>
        </div>

        {/* Discard prompt */}
        {showDiscardPrompt && (
          <div className="border-b border-warning/30 bg-warning/10 px-5 py-3 sm:px-6">
            <p className="text-sm font-semibold text-foreground">Discard changes?</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Your unsaved changes will be lost.</p>
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDiscardPrompt(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6" noValidate>
          {/* Avatar picker */}
          <div className="flex items-center gap-4 rounded-xl border border-border bg-background/50 p-3">
            <UserAvatar
              src={formData.avatar}
              name={formData.name}
              username={formData.username}
              className="h-14 w-14 rounded-full border border-border"
              textClassName="text-xl"
            />
            <div>
              <p className="text-sm font-medium text-foreground">Profile photo</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Upload a photo or use your name letter.</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFile}
                className="sr-only"
              />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <Camera size={13} /> Change Photo
                </button>
                {!isDefaultOrEmptyAvatar(formData.avatar) && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, avatar: '' }))}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    Use Name Letter
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Row 1: Full Name & Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium text-foreground">
                Full Name
              </label>
              <input
                id="profile-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className={inputClass}
                autoComplete="name"
              />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
            </div>

            {/* Username */}
            <div>
              <label htmlFor="profile-user" className="mb-1.5 block text-sm font-medium text-foreground">
                Username
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  @
                </span>
                <input
                  id="profile-user"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value.replace(/[^a-zA-Z0-9_]/g, ''),
                    }))
                  }
                  className={`${inputClass} pl-8`}
                  autoComplete="username"
                />
              </div>
              {errors.username && <p className="mt-1 text-xs text-destructive">{errors.username}</p>}
            </div>
          </div>

          {/* Row 2: Email & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label htmlFor="profile-email" className="mb-1.5 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className={inputClass}
                autoComplete="email"
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="profile-location" className="mb-1.5 block text-sm font-medium text-foreground">
                Location
              </label>
              <input
                id="profile-location"
                type="text"
                placeholder="e.g. New York, USA"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                className={inputClass}
                autoComplete="address-level2"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="profile-bio" className="text-sm font-medium text-foreground">
                Bio
              </label>
              <span
                className={`text-xs ${
                  formData.bio.length > 160 ? 'text-destructive' : 'text-muted-foreground'
                }`}
              >
                {formData.bio.length} / 160
              </span>
            </div>
            <textarea
              id="profile-bio"
              rows={3}
              maxLength={160}
              value={formData.bio}
              onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
              className={`${inputClass} resize-none`}
            />
            {errors.bio && <p className="mt-1 text-xs text-destructive">{errors.bio}</p>}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={handleCloseAttempt}
              disabled={loading}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-primary glow-primary inline-flex min-w-[125px] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70 select-none"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
