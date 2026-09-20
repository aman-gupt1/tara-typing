import { useState } from 'react';
import Modal from '../common/Modal';

export const CustomTextModal = ({
  isOpen,
  onClose,
  onApplyCustomText,
}) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleApply = () => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 10) {
      setError('Custom text must be at least 10 characters long.');
      return;
    }
    setError('');
    onApplyCustomText(trimmed);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Custom Practice Text">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Paste or write your own custom text to practice code, paragraphs, or technical vocabulary.
        </p>

        <div>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError('');
            }}
            placeholder="Paste your paragraph or custom text here..."
            className="w-full h-40 rounded-xl bg-background border border-input focus:border-primary focus:ring-1 focus:ring-ring p-4 pr-3 text-sm font-mono text-foreground placeholder:text-muted-foreground resize-none focus:outline-none transition-colors overflow-y-auto stylish-scrollbar"
          />
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{text.length} characters</span>
          <span>{text.split(/\s+/).filter(Boolean).length} words</span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors select-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="bg-gradient-primary glow-primary rounded-xl px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] select-none"
          >
            Start Custom Test
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomTextModal;
