// import React, { useState } from "react";

// export default function Gallery() {
//   const [images, setImages] = useState(JSON.parse(localStorage.getItem("gallery")) || []);

//   const handleUpload = e => {
//     const reader = new FileReader();
//     reader.onload = function () {
//       const updatedImages = [...images, reader.result];
//       setImages(updatedImages);
//       localStorage.setItem("gallery", JSON.stringify(updatedImages));
//     };
//     if (e.target.files[0]) {
//       reader.readAsDataURL(e.target.files);
//     }
//   };

//   return (
//     <div className="centered-container">
//       <h2>Photo Gallery</h2>
//       <input type="file" accept="image/*" onChange={handleUpload} />
//       <div style={{ display: "flex", flexWrap: "wrap" }}>
//         {images.map((img, i) => (
//           <img src={img} key={i} style={{ width: 100, margin: 4 }} alt="Ganesh festival upload" />
//         ))}
//       </div>
//     </div>
//   );
// }
// import React, { useEffect, useState } from 'react';
// import { addMediaFile, getAllMedia, clearMedia } from '../utils/indexedDBStorage';

// export default function Gallery() {
//   const [mediaFiles, setMediaFiles] = useState([]);

//   useEffect(() => {
//     loadMedia();
//   }, []);

//   const loadMedia = async () => {
//     const all = await getAllMedia();
//     setMediaFiles(all);
//   };

//   const handleUpload = async (e) => {
//     const files = Array.from(e.target.files);
//     for (let file of files) {
//       // Store file object directly because IndexedDB supports Blobs
//       await addMediaFile(file);
//     }
//     loadMedia();
//   };

//   const clearAll = async () => {
//     await clearMedia();
//     setMediaFiles([]);
//   };

//   return (
//     <div className="centered-container" style={{ maxWidth: 720 }}>
//       <h2>Photo & Video Gallery</h2>
//       <input
//         type="file"
//         accept="image/*,video/*"
//         multiple
//         onChange={handleUpload}
//         style={{ marginBottom: 16 }}
//       />
//       <button onClick={clearAll} style={{ marginBottom: 16 }}>Clear Gallery</button>
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
//         {mediaFiles.map((file, i) => {
//           if (file.type.startsWith('video')) {
//             return (
//               <video
//                 key={i}
//                 src={URL.createObjectURL(file)} //URL.createObjectURL() for efficient preview without loading everything into memory.
//                 controls
//                 style={{ width: 200, borderRadius: 12, boxShadow: '0 2px 10px rgba(211,84,0,0.13)' }}
//               />
//             );
//           }
//           // otherwise, image
//           return (
//             <img
//               key={i}
//               src={URL.createObjectURL(file)}
//               alt="Ganesh festival media"
//               style={{ width: 200, borderRadius: 12, boxShadow: '0 2px 10px rgba(211,84,0,0.13)' }}
//             />
//           );
//         })}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useRef } from 'react';
import { addMediaFile, getAllMedia, deleteMediaById } from '../utils/indexedDBStorage';

const PAGE_SIZE = 4;

export default function Gallery() {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [page, setPage] = useState(1);
  const [displayedFiles, setDisplayedFiles] = useState([]);
  const objectUrlsRef = useRef({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    loadMedia();
    // Cleanup object URLs on unmount
    return () => {
      Object.values(objectUrlsRef.current).forEach(URL.revokeObjectURL);
    };
  }, []);

  useEffect(() => {
    const sliced = mediaFiles.slice(0, PAGE_SIZE * page);
    setDisplayedFiles(sliced);
  }, [mediaFiles, page]);

  const loadMedia = async () => {
    const all = await getAllMedia();
    setMediaFiles(all);
    setSelectedIds([]);
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      await addMediaFile(file);
    }
    loadMedia();
    setPage(1);
  };

  const deleteSelected = async () => {
    for (const id of selectedIds) {
      if (objectUrlsRef.current[id]) {
        URL.revokeObjectURL(objectUrlsRef.current[id]);
        delete objectUrlsRef.current[id];
      }
      await deleteMediaById(id);
    }
    loadMedia();
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const selectAllOnPage = () => {
    const allIds = displayedFiles.map(file => file.id);
    const allSelected = allIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      // Unselect all on this page
      setSelectedIds(prev => prev.filter(id => !allIds.includes(id)));
    } else {
      // Select all on this page
      setSelectedIds(prev => [...new Set([...prev, ...allIds])]);
    }
  };

  const loadMore = () => {
    if (PAGE_SIZE * page < mediaFiles.length) {
      setPage(page + 1);
    }
  };

  displayedFiles.forEach(file => {
    if (!objectUrlsRef.current[file.id]) {
      objectUrlsRef.current[file.id] = URL.createObjectURL(file);
    }
  });

  // Preview handler
  const openPreview = (file) => {
    setPreviewUrl(objectUrlsRef.current[file.id]);
    setPreviewType(file.type);
  };
  const closePreview = () => {
    setPreviewUrl(null);
    setPreviewType(null);
  };

  const isAllSelectedForPage = displayedFiles.every(file => selectedIds.includes(file.id)) && displayedFiles.length > 0;

  return (
    <div className="centered-container" style={{ maxWidth: 760 }}>
      <h2>Photo & Video Gallery</h2>

      <input
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleUpload}
        style={{ marginBottom: 16 }}
      />

      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
        <label>
          <input
            type="checkbox"
            checked={isAllSelectedForPage}
            onChange={selectAllOnPage}
          /> Select All on Page
        </label>

        {selectedIds.length > 0 && (
          <button onClick={deleteSelected} style={deleteSelectedBtnStyle}>
            Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {displayedFiles.map((file) => {
          const url = objectUrlsRef.current[file.id];
          const isSelected = selectedIds.includes(file.id);

          if (file.type.startsWith('video')) {
            return (
              <div
                key={file.id}
                style={{
                  width: 200,
                  textAlign: 'center',
                  border: isSelected ? '3px solid #d35400' : '1px solid #ddd',
                  borderRadius: 12,
                  padding: 6,
                  cursor: 'pointer',
                }}
              >
                <video
                  src={url}
                  controls={false}
                  style={{ width: '100%', borderRadius: 12 }}
                  onClick={() => openPreview(file)}
                  title="Click to preview"
                />
                <label style={{ marginTop: 6, display: 'block', cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(file.id)}
                  />
                  {' '}Select
                </label>
              </div>
            );
          }

          // Image
          return (
            <div
              key={file.id}
              style={{
                width: 200,
                textAlign: 'center',
                border: isSelected ? '3px solid #d35400' : '1px solid #ddd',
                borderRadius: 12,
                padding: 6,
                cursor: 'pointer',
              }}
            >
              <img
                src={url}
                alt="Ganesh festival media"
                style={{ width: '100%', borderRadius: 12 }}
                onClick={() => openPreview(file)}
                title="Click to preview"
              />
              <label >
              {/* style={{ marginTop: 6, display: 'block', cursor: 'pointer', userSelect: 'none' }}> */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(file.id)}
                /> </label>
                {/* {' '}Select
              </label> */}
            </div>
          );
        })}
      </div>

      {PAGE_SIZE * page < mediaFiles.length && (
        <button onClick={loadMore} style={{ marginTop: 20 }}>
          Load More
        </button>
      )}

      {/* Preview Modal */}
      {previewUrl && (
        <div style={modalOverlayStyle} onClick={closePreview}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <button onClick={closePreview} style={modalCloseBtnStyle} aria-label="Close preview">×</button>
            {previewType.startsWith('video') ? (
              <video src={previewUrl} controls style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 12 }} autoPlay />
            ) : (
              <img src={previewUrl} alt="Preview" style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 12 }} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const deleteSelectedBtnStyle = {
  padding: '8px 20px',
  backgroundColor: '#d35400',
  color: '#fff',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  fontWeight: '600',
  boxShadow: '0 2px 10px rgba(211,84,0,0.5)',
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
  padding: 20,
};

const modalContentStyle = {
  position: 'relative',
  background: 'white',
  padding: 20,
  borderRadius: 12,
  maxWidth: '95vw',
  maxHeight: '90vh',
  boxShadow: '0 0 30px rgba(211,84,0,0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalCloseBtnStyle = {
  position: 'absolute',
  top: 8,
  right: 8,
  background: '#d35400',
  border: 'none',
  borderRadius: '50%',
  width: 32,
  height: 32,
  color: 'white',
  fontWeight: 'bold',
  fontSize: 20,
  cursor: 'pointer',
  lineHeight: 1,
};
