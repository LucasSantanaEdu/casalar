'use client';

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTools, createTool, updateTool, deleteTool, Tool } from "@/store/toolsSlice";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { AppDispatch, RootState } from "@/store";

const ToolsForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const tools = useSelector((state: RootState) => state.tools?.data || []);
    const loading = useSelector((state: RootState) => state.tools?.loading || false);

    const [form, setForm] = useState<Tool>({
        id: undefined,
        name: "",
        type: "",
        availability: "",
        condition: ""
    });

    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchTools());
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            dispatch(updateTool({ ...form, id: editingId }));
            setEditingId(null);
        } else {
            dispatch(createTool(form));
        }
        setForm({ id: undefined, name: "", type: "", availability: "", condition: "" });
    };

    const handleEdit = (tool: Tool) => {
        setForm(tool);
        setEditingId(tool.id || null);
    };

    const handleDelete = (id?: string) => {
        if (id) dispatch(deleteTool(id));
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
                {["name", "type", "availability", "condition"].map((field) => (
                    <div key={field} className="relative">
                        <input
                            type="text"
                            id={field}
                            name={field}
                            value={form[field as keyof Tool]} // ✅ Tipagem correta
                            onChange={handleChange}
                            required
                            placeholder={field}
                            className="peer h-10 w-full border border-green-400 dark:border-green-300 rounded-md bg-white dark:bg-black text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:border-orange-500 pl-3 transition-colors"
                        />
                        <label
                            htmlFor={field}
                            className="absolute left-3 -top-6 text-gray-700 dark:text-green-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-green-300 peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-orange-500"
                        >
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                    </div>
                ))}

                <button
                    type="submit"
                    className="sm:col-span-2 w-full bg-green-600 text-white dark:text-black py-2 rounded hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500 transition"
                >
                    {editingId ? "Atualizar" : "Cadastrar"}
                </button>
            </form>

            <h3 className="font-semibold mb-3 text-gray-700 dark:text-green-300 text-sm sm:text-base">
                Cadastradas
            </h3>

            <div className="border max-w-[90vw] lg:max-w-full border-gray-300 dark:border-gray-700 rounded-lg px-2 sm:px-4 py-4 w-full mt-4 mb-16 overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-green-500 dark:bg-green-900 text-gray-800 dark:text-white">
                            <th className="text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">Nome</th>
                            <th className="text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">Tipo</th>
                            <th className="hidden sm:table-cell text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">
                                Disponibilidade
                            </th>
                            <th className="text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">Condição</th>
                            <th className="text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tools.length > 0 ? (
                            tools.map((tool) => (
                                <tr
                                    key={tool.id}
                                    className="dark:text-white hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
                                >
                                    <td className="text-xs sm:text-sm px-2 sm:px-4 py-2 border-b truncate">{tool.name}</td>
                                    <td className="text-xs sm:text-sm px-2 sm:px-4 py-2 border-b truncate">{tool.type}</td>
                                    <td className="hidden sm:table-cell text-xs sm:text-sm px-2 sm:px-4 py-2 border-b truncate">{tool.availability}</td>
                                    <td className="text-xs sm:text-sm px-2 sm:px-4 py-2 border-b truncate">{tool.condition}</td>
                                    <td className="px-2 sm:px-4 py-3 border-b flex justify-start gap-2 sm:gap-3">
                                        <button onClick={() => handleEdit(tool)} className="text-blue-500 hover:text-blue-700">
                                            <FiEdit />
                                        </button>
                                        <button onClick={() => handleDelete(tool.id)} className="text-red-500 hover:text-red-700">
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center px-2 sm:px-4 py-2 border-b text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                    Nenhuma ferramenta cadastrada
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {loading && (
                    <p className="text-gray-500 dark:text-gray-300 mt-2 text-xs sm:text-sm">
                        Carregando...
                    </p>
                )}
            </div>
        </div>
    );
};

export default ToolsForm;
