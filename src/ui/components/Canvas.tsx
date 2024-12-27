import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { FabricImage, FabricObject, PencilBrush } from 'fabric';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { FaImage, FaRegCircle, FaRegTrashAlt } from 'react-icons/fa';
import { MdOutlineRectangle, MdRedo, MdUndo, MdZoomIn, MdZoomOut } from 'react-icons/md';
import { TbLine } from 'react-icons/tb';
import { BiPencil } from 'react-icons/bi';

interface VehicleData {
    files: string;
}

interface SvgEditorProps {
    vehicleData?: VehicleData;
}

export interface SvgEditorRef {
    downloadImage: () => void;
}

const SvgEditor = forwardRef<SvgEditorRef, SvgEditorProps>(({ vehicleData }, ref) => {
    const { editor, onReady } = useFabricJSEditor();

    const history: FabricObject[] = [];

    const onAddCircle = () => {
        editor?.addCircle();
    };

    const onAddRectangle = () => {
        editor?.addRectangle();
    };

    const onAddPath = () => {
        editor?.addLine();
    };

    const toggleDraw = () => {
        const canvas = editor?.canvas;
        if (canvas) {
            canvas.isDrawingMode = !canvas.isDrawingMode;

            if (canvas.isDrawingMode && !canvas.freeDrawingBrush) {
                canvas.freeDrawingBrush = new PencilBrush(canvas);
                canvas.freeDrawingBrush.width = 3;
            }
        }
    };

    const deleteObject = () => {
        const activeObject = editor?.canvas?.getActiveObject();
        if (activeObject) {
            editor?.canvas.remove(activeObject);
        }
    };

    const undo = () => {
        if (editor?.canvas && editor.canvas._objects.length > 0) {
            const removedObject = editor.canvas._objects.pop();
            if (removedObject) {
                history.push(removedObject);
            }
            editor.canvas.renderAll();
        }
    };

    const redo = () => {
        if (editor?.canvas && history.length > 0) {
            const restoredObject = history.pop();
            if (restoredObject) {
                editor.canvas.add(restoredObject);
            }
        }
    };

    const addImageToCanvas = (value: string) => {
        const image = new Image();
        image.crossOrigin = 'Anonymous';
        image.src = value;

        image.onload = () => {
            const imgInstance = new FabricImage(image, {
                left: 250,
                top: 250,
                scaleX: 0.2,
                scaleY: 0.2,
            });

            editor?.canvas.add(imgInstance);
            editor?.canvas.renderAll();
        };
    };

    useEffect(() => {
        if (vehicleData) {
            Object.entries(vehicleData).forEach(([, value]: [string, string]) => {
                console.log('🚀 ~ Object.entries ~ value:', value);
                addImageToCanvas(value);
            });
        }
    }, [vehicleData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                const image = new Image();
                image.src = result;
                image.onload = () => {
                    const imgInstance = new FabricImage(image, {
                        left: 250,
                        top: 250,
                        scaleX: 0.2,
                        scaleY: 0.2,
                    });
                    editor?.canvas.add(imgInstance);
                    editor?.canvas.renderAll();
                };
            };
            reader.readAsDataURL(files[0]);
        }
    };

    useImperativeHandle(ref, () => ({
        downloadImage() {
            const dataURL = editor?.canvas.toDataURL({
                format: 'png',
                quality: 1,
            });
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'sketch.png';
            link.click();
        },
    }));

    return (
        <div className="App flex p-4">
            <div className="h-[80vh] w-1/12 pr-4 grid-cols-2 flex flex-col gap-4 justify-start items-start">
                <div className="flex justify-evenly w-full gap-4">
                    <FaRegCircle
                        size={30}
                        className="hover:scale-110 hover:transition"
                        onClick={onAddCircle}
                    />
                    <MdOutlineRectangle
                        size={32}
                        className="hover:scale-110 hover:transition"
                        onClick={onAddRectangle}
                    />
                </div>
                <div className="flex justify-evenly w-full gap-4">
                    <TbLine
                        size={32}
                        className="hover:scale-110 hover:transition"
                        onClick={onAddPath}
                    />
                    <BiPencil
                        size={32}
                        className="hover:scale-110 hover:transition"
                        onClick={toggleDraw}
                    />
                </div>
                <div className="flex justify-evenly w-full gap-4">
                    <MdZoomIn
                        size={32}
                        className="hover:scale-110 hover:transition"
                        onClick={() => editor?.canvas.setZoom(editor?.canvas.getZoom() + 0.2)}
                    />
                    <MdZoomOut
                        size={32}
                        className="hover:scale-110 hover:transition"
                        onClick={() => editor?.canvas.setZoom(editor?.canvas.getZoom() - 0.2)}
                    />
                </div>
                <div className="flex justify-evenly w-full gap-4">
                    <MdUndo size={32} className="hover:scale-110 hover:transition" onClick={undo} />
                    <MdRedo size={32} className="hover:scale-110 hover:transition" onClick={redo} />
                </div>
                <div className="flex justify-evenly w-full gap-4">
                    <FaRegTrashAlt
                        size={30}
                        className="hover:scale-110 hover:transition"
                        onClick={deleteObject}
                    />
                    <label className="hover:scale-110 hover:transition">
                        <FaImage size={30} className="hover:scale-110 hover:transition" />
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>
            </div>
            <FabricJSCanvas className="w-11/12 border border-black" onReady={onReady} />
        </div>
    );
});

export default SvgEditor;
