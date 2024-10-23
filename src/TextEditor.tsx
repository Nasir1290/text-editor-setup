import React, { useState, useEffect } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import axios from "axios";
import './TextEditor.css'; // Add custom styling for responsiveness and design

const TextEditor: React.FC = () => {
    const [ editorContent, setEditorContent ] = useState<string>(
        localStorage.getItem("blogContent") || ""
    );
    const [ blogTitle, setBlogTitle ] = useState<string>(
        localStorage.getItem("blogTitle") || ""
    );
    const [ blogType, setBlogType ] = useState<string>(
        localStorage.getItem("blogType") || "Category"
    );

    // Function to handle changes in the editor content
    const handleContentChange = (content: string) => {
        setEditorContent(content);
        localStorage.setItem("blogContent", content); // Save blog content on the fly
    };

    // Handle the Save Blog button
    const handleSaveBlog = () => {
        const blogData = {
            title: blogTitle,
            category: blogType,
            content: editorContent,
        };

        console.log("Blog Data:", blogData); // Send data to the backend API in future

        // Clear localStorage and reset fields
        localStorage.removeItem("blogTitle");
        localStorage.removeItem("blogType");
        localStorage.removeItem("blogContent");
        setBlogTitle("");
        setBlogType("Category");
        setEditorContent("");
    };

    // Image upload handler function
    const handleImageUpload = async (targetElement, index, state, imageInfo, remainingFilesCount) => {
        const file = imageInfo[ 0 ];
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post('https://api.imgbb.com/1/upload?key=YOUR_API_KEY', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const imageUrl = response.data.data.url;
            // Insert the image URL into the editor
            targetElement.insertImage(imageUrl, null, null, imageInfo[ index ].name);
        } catch (error) {
            console.error('Image upload failed:', error);
        }
    };

    return (
        <div className="editor-container">
            <h2 className="title">Create Your Blog</h2>

            {/* Blog Title Section */}
            <div className="form-group">
                <label className="input-label" htmlFor="blog-title">Enter Your Blog Title</label>
                <input
                    id="blog-title"
                    type="text"
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="Enter Blog Title"
                    className="blog-title"
                />
            </div>

            {/* Blog Category Section */}
            <div className="form-group">
                <label className="input-label" htmlFor="blog-category">Choose Your Blog Category</label>
                <select
                    id="blog-category"
                    value={blogType}
                    onChange={(e) => setBlogType(e.target.value)}
                    className="blog-type"
                >
                    <option value="Category" disabled>Category</option>
                    <option value="Technology">Technology</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                    <option value="Travel">Travel</option>
                    <option value="Finance">Finance</option>
                </select>
            </div>

            {/* SunEditor for Blog Content */}
            <SunEditor
                setContents={editorContent}
                onChange={handleContentChange}
                setOptions={{
                    height: 300, // Adjust the height of the editor
                    buttonList: [
                        [ "undo", "redo", "bold", "italic", "underline", "strike" ],
                        [ "list", "outdent", "indent" ],
                        [ "align" ],
                        [ "font", "fontSize", "formatBlock" ],
                        [ "fontColor", "hiliteColor" ],
                        [ "link", "image", "video" ],
                        [ "removeFormat" ],
                        [ "table", "horizontalRule", "subscript", "superscript" ]
                    ],
                    font: [
                        "Arial", "Comic Sans MS", "Courier New", "Impact", "Georgia", "Tahoma", "Trebuchet MS", "Verdana"
                    ],
                    fontSize: [ 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 48, 64, 72 ], // Text size options
                    imageUploadHandler: handleImageUpload,
                }}
                placeholder="Start writing your blog content here..."
            />

            {/* Save Blog Button */}
            <button className="save-blog-btn" onClick={handleSaveBlog}>
                Save Blog
            </button>

            <div style={{ marginTop: "20px" }}>
                <h3>Preview</h3>
                <h4>{blogTitle}</h4>
                <h5>Category: {blogType}</h5>
                <div dangerouslySetInnerHTML={{ __html: editorContent }} />
            </div>
        </div>
    );
};

export default TextEditor;
