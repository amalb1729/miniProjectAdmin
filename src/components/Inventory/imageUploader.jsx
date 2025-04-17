import { IKContext, IKImage, IKUpload } from 'imagekitio-react';
import { useEffect, useState } from 'react';

function ImageUploader({item}) {
    const [imageKey, setImageKey] = useState(Date.now());
    const [url, setUrl] = useState(item.pictureURL);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

const authenticator =  async () => {
    try {
        const response = await fetch('/api/item/uploadCheck');
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error) {
        throw new Error(`Authentication request failed: ${error.message}`);
    }
};

const onError = err => {
    console.error("Upload Error:", err);
    setUploadError("Failed to upload image");
    setIsUploading(false);
};
  
const onSuccess = async(res) => {
    try {
        const response = await fetch(`/api/item/upload/${item._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: res.filePath })
        });
        if (!response.ok) {
            throw new Error(`Upload failed with status ${response.status}`);
        }
        const data = await response.json();
        setUrl(data.url);
        setImageKey(Date.now());
        setUploadError("");
    } catch (error) {
        console.error("❌ Error uploading image:", error);
        setUploadError("Failed to save image");
    } finally {
        setIsUploading(false);
    }
};





    return(
        <div className="image-upload-container">
            <div className="image-preview-container">
                <IKImage
                    key={imageKey}
                    path={url}
                    urlEndpoint={import.meta.env.VITE_PUBLIC_URL_ENDPOINT}
                    transformation={[{
                        height: 100,
                        width: 100
                    }]}
                    className="image-preview"
                    onError={(e) => (e.target.src = "https://placehold.co/100")}
                    alt={item.name}
                />
            </div>
            
            <div className="upload-controls">
                <div className="upload-button-wrapper">
                    <button 
                        type="button" 
                        className={`upload-button ${isUploading ? 'uploading' : ''}`}
                        disabled={isUploading}
                    >
                        <span className="upload-icon">📸</span>
                        {isUploading ? 'Uploading...' : 'Change Image'}
                    </button>
                    <IKContext
                        publicKey={import.meta.env.VITE_PUBLIC_PUBLIC_KEY}
                        urlEndpoint={import.meta.env.VITE_PUBLIC_URL_ENDPOINT}
                        authenticator={authenticator}
                    >
                        <IKUpload
                            useUniqueFileName={true}
                            onError={onError}
                            onSuccess={onSuccess}
                            onUploadStart={() => {
                                setIsUploading(true);
                                setUploadError("");
                            }}
                            folder={"/items"}
                            style={{ 
                                opacity: 0, 
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                cursor: 'pointer'
                            }}
                        />
                    </IKContext>
                </div>
                {uploadError ? (
                    <span className="error-message">{uploadError}</span>
                ) : (
                    <span className="upload-text">{isUploading ? 'Please wait...' : 'Click to upload a new image'}</span>
                )}
            </div>
        </div>
    )



}

export default ImageUploader;