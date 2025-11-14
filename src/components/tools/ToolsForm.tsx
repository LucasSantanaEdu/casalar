'use client';

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTools, createTool, updateTool, deleteTool, Tool } from "@/store/toolsSlice";
import { FiTrash2, FiEdit, FiEye, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { AppDispatch, RootState } from "@/store";

const ITEMS_PER_PAGE = 10;

const initialFormState: Omit<Tool, 'id'> = {
    name: "",
    type: "",
    availability: "",
    condition: "",
    notes: "" 
};

const ToolsForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const tools = useSelector((state: RootState) => state.tools?.data || []);
    const loading = useSelector((state: RootState) => state.tools?.loading || false);

    const [form, setForm] = useState(initialFormState);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const paginatedTools = tools.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    const totalPages = Math.ceil(tools.length / ITEMS_PER_PAGE);

    useEffect(() => {
        dispatch(fetchTools());
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = {
            ...form,
            notes: form.notes || undefined, 
        };

        if (editingId) {
            dispatch(updateTool({ ...payload, id: editingId }));
            setEditingId(null);
        } else {
            dispatch(createTool(payload));
        }
        setForm(initialFormState);
    };

    const handleEdit = (tool: Tool) => {
        const editForm = {
            ...initialFormState,
            ...tool,
            notes: tool.notes || "", 
        };
        setForm(editForm);
        setEditingId(tool.id || null);
    };

    const handleDelete = (id?: string) => {
        if (id) dispatch(deleteTool(id));
    };

    const handleViewDetails = (tool: Tool) => {
        setSelectedTool(tool);
    };

    const closePopup = () => {
        setSelectedTool(null);
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const toolFields: (keyof Omit<Tool, 'id'>)[] = ["name", "type", "availability", "condition", "notes"];
    
    const fieldLabels: { [key in keyof Omit<Tool, 'id'>]: string } = {
        name: "Nome da Ferramenta",
        type: "Tipo (ex: Elétrica, Manual)",
        availability: "Disponibilidade (ex: Em uso, Disponível)",
        condition: "Condição (ex: Nova, Usada)",
        notes: "Observações (Opcional)" 
    };

    return (
        <div className="sm:p-4">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 dark:text-green-300">
                Cadastro de Ferramentas
            </h2>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6"
            >
                {toolFields.map((field) => {
                    if (field === 'notes') return null;

                    return (
                        <div key={field} className="relative">
                            <input
                                type="text"
                                id={field}
                                name={field}
                                value={form[field]} 
                                onChange={handleChange}
                                required
                                placeholder={fieldLabels[field]}
                                className="peer h-10 w-full border border-green-400 dark:border-green-300 rounded-md bg-white dark:bg-black text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:border-orange-500 pl-3 transition-colors"
                            />
                            <label
                                htmlFor={field}
                                className="absolute left-3 -top-6 text-gray-700 dark:text-green-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-green-300 peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-orange-500"
                            >
                                {fieldLabels[field]} 
                            </label>
                        </div>
                    );
                })}

                <div className="relative sm:col-span-2">
                    <textarea
                        id="notes"
                        name="notes"
                        value={form.notes || ''}
                        onChange={handleChange}
                        placeholder={fieldLabels.notes}
                        className="peer h-24 w-full border border-green-400 dark:border-green-300 rounded-md bg-white dark:bg-black text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:border-orange-500 pl-3 pt-2 transition-colors"
                    />
                    <label
                        htmlFor="notes"
                        className="absolute left-3 -top-6 text-gray-700 dark:text-green-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-green-300 peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-orange-500"
                    >
                        {fieldLabels.notes}
                    </label>
                </div>

                <button
                    type="submit"
                    className="sm:col-span-2 w-full bg-green-600 text-white dark:text-black py-2 rounded hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500 transition"
                >
                    {editingId ? "Atualizar Ferramenta" : "Cadastrar Ferramenta"}
                </button>
            </form>

            <h3 className="font-semibold mb-3 text-gray-700 dark:text-green-300 text-sm sm:text-base">
                Ferramentas Cadastradas
            </h3>

            <div className="border max-w-[90vw] lg:max-w-full border-gray-300 dark:border-gray-700 rounded-lg w-full mt-4 mb-16 overflow-x-auto">
                <table className="table-fixed w-full border-collapse">
                    <thead>
                        <tr className="bg-green-500 dark:bg-green-900 text-gray-800 dark:text-white">
                            <th className="w-1/4 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">Nome</th>
                            <th className="w-1/5 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">Tipo</th>
                            <th className="hidden sm:table-cell w-1/5 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">
                                Disponibilidade
                            </th>
                            <th className="hidden sm:table-cell w-1/5 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">Condição</th>
                            <th className="w-1/5 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedTools.length > 0 ? (
                            paginatedTools.map((tool) => (
                                <tr
                                    key={tool.id}
                                    className="dark:text-white hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
                                >
                                    <td className="text-xs sm:text-sm px-2 sm:px-4 py-2 border-b truncate align-top">{tool.name}</td>
                                    <td className="text-xs sm:text-sm px-2 sm:px-4 py-2 border-b truncate align-top">{tool.type}</td>
                                    <td className="hidden sm:table-cell text-xs sm:text-sm px-2 sm:px-4 py-2 border-b truncate align-top">{tool.availability}</td>
                                    <td className="hidden sm:table-cell text-xs sm:text-sm px-2 sm:px-4 py-2 border-b truncate align-top">{tool.condition}</td>
                                    
                                    <td className="px-2 sm:px-4 py-3 border-b flex justify-start gap-3 sm:gap-4 whitespace-nowrap align-top">
                                        <button 
                                            onClick={() => handleViewDetails(tool)} 
                                            className="text-gray-500 hover:text-blue-500"
                                            title="Visualizar Detalhes"
                                        >
                                            <FiEye />
                                        </button>
                                        <button 
                                            onClick={() => handleEdit(tool)} 
                                            className="text-blue-500 hover:text-blue-700"
                                            title="Editar"
                                        >
                                            <FiEdit />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(tool.id)} 
                                            className="text-red-500 hover:text-red-700"
                                            title="Excluir"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center px-2 sm:px-4 py-2 border-b text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                    {loading ? "Carregando..." : "Nenhuma ferramenta cadastrada"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiChevronLeft />
                    </button>
                    <span className="text-gray-700 dark:text-gray-300">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiChevronRight />
                    </button>
                </div>
            )}

            {loading && tools.length > 0 && (
                <p className="text-gray-500 dark:text-gray-300 mt-2 text-xs sm:text-sm">
                    Carregando...
                </p>
            )}

            {selectedTool && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                    onClick={closePopup}
                >
                    <div 
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 max-w-lg text-gray-800 dark:text-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-green-300">{selectedTool.name}</h3>
                            <button onClick={closePopup} className="text-gray-500 hover:text-red-500">
                                <FiX size={24} />
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            <p><strong>Tipo:</strong> {selectedTool.type}</p>
                            <p><strong>Disponibilidade:</strong> {selectedTool.availability}</p>
                            <p><strong>Condição:</strong> {selectedTool.condition}</p>
                            
                            <hr className="border-gray-300 dark:border-gray-600"/>
                            <p><strong>Observações:</strong></p>
                            <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md text-sm whitespace-pre-wrap">
                                {selectedTool.notes || "Nenhuma observação."}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ToolsForm;