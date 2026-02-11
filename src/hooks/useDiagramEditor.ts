/**
 * useDiagramEditor — manages open/close state for the Draw.io editor
 */

import { useState, useCallback } from 'react';

export function useDiagramEditor() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentXml, setCurrentXml] = useState('');

  const openEditor = useCallback((xml?: string) => {
    setCurrentXml(xml || '');
    setIsEditorOpen(true);
  }, []);

  const closeEditor = useCallback(() => {
    setIsEditorOpen(false);
  }, []);

  const handleEditorSave = useCallback(
    (xml: string, onSave?: (xml: string) => void) => {
      setCurrentXml(xml);
      onSave?.(xml);
    },
    []
  );

  return {
    isEditorOpen,
    currentXml,
    openEditor,
    closeEditor,
    handleEditorSave,
  };
}
