/**
 * DiagramEditor — Draw.io iframe editor with postMessage communication
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { Modal, Button, Alert, useTheme2 } from '@grafana/ui';
import { compress, decompress, isCompressed } from '../utils/compression';
import { buildEditorUrl, getDefaultDiagram } from '../utils/drawio';

interface DiagramEditorProps {
  isOpen: boolean;
  initialXml?: string;
  editorUrl?: string;
  editorTheme?: string;
  onSave: (xml: string) => void;
  onClose: () => void;
}

export const DiagramEditor: React.FC<DiagramEditorProps> = ({
  isOpen,
  initialXml = '',
  editorUrl = 'https://embed.diagrams.net',
  editorTheme = 'light',
  onSave,
  onClose,
}) => {
  const theme = useTheme2();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const url = buildEditorUrl(editorUrl, editorTheme);

  // Handle messages from the editor iframe
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (
        !event.origin.includes('diagrams.net') &&
        !event.origin.includes('draw.io')
      ) {
        return;
      }

      let message: any;
      try {
        message =
          typeof event.data === 'string'
            ? JSON.parse(event.data)
            : event.data;
      } catch {
        return;
      }

      switch (message.event) {
        case 'init':
          handleEditorInit();
          break;
        case 'load':
          setIsLoading(false);
          break;
        case 'save':
          if (message.xml) {
            handleSaveXml(message.xml);
          }
          break;
        case 'exit':
          handleExit();
          break;
        case 'modified':
          setHasUnsavedChanges(true);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleEditorInit = useCallback(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win) {
      return;
    }

    let xmlToLoad = initialXml;
    if (xmlToLoad && isCompressed(xmlToLoad)) {
      try {
        xmlToLoad = decompress(xmlToLoad);
      } catch {
        // Use as-is
      }
    }

    win.postMessage(
      JSON.stringify({
        action: 'load',
        xml: xmlToLoad || getDefaultDiagram(),
        autosave: 1,
      }),
      '*'
    );
  }, [initialXml]);

  const handleSaveXml = useCallback(
    (xml: string) => {
      try {
        const compressed = compress(xml);
        onSave(compressed);
        setHasUnsavedChanges(false);

        const win = iframeRef.current?.contentWindow;
        if (win) {
          win.postMessage(
            JSON.stringify({ action: 'status', modified: false }),
            '*'
          );
        }
      } catch {
        setError('Failed to save diagram');
      }
    },
    [onSave]
  );

  const handleExit = useCallback(() => {
    if (hasUnsavedChanges) {
      if (
        window.confirm(
          'You have unsaved changes. Are you sure you want to close?'
        )
      ) {
        onClose();
      }
    } else {
      onClose();
    }
  }, [hasUnsavedChanges, onClose]);

  const handleExportPng = useCallback(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win) {
      return;
    }
    win.postMessage(
      JSON.stringify({ action: 'export', format: 'png', scale: 2 }),
      '*'
    );
  }, []);

  if (!isOpen) {
    return null;
  }

  const styles = getStyles(theme);

  return (
    <Modal
      title="Diagram Editor"
      isOpen={isOpen}
      onDismiss={handleExit}
      className={styles.modal}
    >
      <div className={styles.container}>
        {error && (
          <Alert severity="error" title="Editor Error">
            {error}
          </Alert>
        )}
        {isLoading && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Loading editor...</p>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={url}
          className={styles.iframe}
          style={{ display: isLoading ? 'none' : 'block' }}
          frameBorder="0"
          title="Diagram Editor"
        />
        <div className={styles.footer}>
          <div>
            {hasUnsavedChanges && (
              <span className={styles.unsaved}>Unsaved changes</span>
            )}
          </div>
          <div className={styles.footerRight}>
            <Button variant="secondary" onClick={handleExportPng} icon="download-alt">
              Export PNG
            </Button>
            <Button variant="secondary" onClick={handleExit}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  modal: css`
    width: 90vw !important;
    height: 90vh !important;
    max-width: none !important;
  `,
  container: css`
    display: flex;
    flex-direction: column;
    height: calc(90vh - 120px);
    position: relative;
  `,
  iframe: css`
    flex: 1;
    width: 100%;
    border: none;
    background: white;
  `,
  loading: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    p {
      margin-top: 20px;
      color: ${theme.colors.text.secondary};
    }
  `,
  spinner: css`
    width: 40px;
    height: 40px;
    border: 4px solid ${theme.colors.border.weak};
    border-top-color: ${theme.colors.primary.main};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
  footer: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-top: 1px solid ${theme.colors.border.weak};
    margin-top: 12px;
  `,
  footerRight: css`
    display: flex;
    gap: 8px;
  `,
  unsaved: css`
    color: ${theme.colors.warning.text};
    font-size: 13px;
  `,
});
