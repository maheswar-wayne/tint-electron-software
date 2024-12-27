import { useEffect, useRef, useState } from 'react';
import SvgEditor from '../components/Canvas';
import Button from '../components/atomic/Button';
import Select from '../components/atomic/Select';
import apiClient from '../config/apiClient';

const Editor = () => {
    const [brands, setBrands] = useState<{ name: string; _id: string }[]>([]);
    const [yearData, setYearData] = useState<{ name: string; _id: string }[]>([]);
    const [modelData, setModelData] = useState<{ name: string; _id: string }[]>([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [vehicleData, setVehicleData] = useState([]);

    const svgEditorRef = useRef<any>(null);

    const getBrands = async () => {
        const response = await apiClient.get('/vehicle/brand');
        setBrands(response.data.data);
        const yearData = [];
        for (let i = 1980; i <= 2025; i++) {
            yearData.push({ name: i.toString(), _id: i.toString() });
        }
        setYearData(yearData);
    };

    const getModel = async () => {
        const response = await apiClient.get(`/vehicle/get-with-brand?brand=${selectedBrand}`);
        const modelData = [];
        for (const { model, _id } of response.data.data) {
            modelData.push({ name: model, _id });
        }
        setModelData(modelData);
    };

    useEffect(() => {
        getBrands();
    }, []);

    useEffect(() => {
        getModel();
    }, [selectedBrand]);

    const handleSearch = async () => {
        const searchRes = await apiClient.get(`/vehicle/${selectedModel}`);
        setVehicleData(searchRes.data.data);
    };

    return (
        <div className="p-0">
            <div className="w-full text-start px-6 py-4 text-xl font-bold">Tint-Care</div>
            <div className="w-full bg-[#c1b076] px-6 py-1 text-[#c1b076]">.</div>

            <div className="flex justify-between w-full px-6 py-4 bg-gray-200">
                <div className="flex gap-4">
                    <Select
                        itemLabel="Brand"
                        items={brands && brands}
                        setItems={setSelectedBrand}
                    />
                    <Select
                        itemLabel="Year"
                        items={yearData && yearData}
                        setItems={setSelectedYear}
                    />
                    <Select
                        itemLabel="Model"
                        items={modelData && modelData}
                        setItems={setSelectedModel}
                    />
                    <Button onClick={() => handleSearch()}>Search</Button>
                </div>
                <Button
                    onClick={() => {
                        svgEditorRef.current?.downloadImage();
                    }}
                >
                    Cut Sketch
                </Button>
            </div>
            <SvgEditor vehicleData={vehicleData && vehicleData.files} ref={svgEditorRef} />
        </div>
    );
};

export default Editor;
