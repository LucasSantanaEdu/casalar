'use client';

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    fetchServices, 
    createService, 
    updateService, 
    deleteService, 
    Service 
} from "@/store/servicesSlice";
import { FiTrash2, FiEdit, FiEye, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { AppDispatch, RootState } from "@/store";

const ITEMS_PER_PAGE = 10;

const initialFormState: Omit<Service, 'id'> = {
    description: "",
    estimatedDuration: "",
    cost: 0,
    startDate: "", 
    notes: ""        
};

const ServicesForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const services = useSelector((state: RootState) => state.services?.data || []);
    const loading = useSelector((state: RootState) => state.services?.loading || false);

    const [form, setForm] = useState<Omit<Service, 'id'> & { id?: string }>(initialFormState);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const paginatedServices = services.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    const totalPages = Math.ceil(services.length / ITEMS_PER_PAGE);

    useEffect(() => {
        dispatch(fetchServices());
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        const isNumberField = name === 'cost';
        
        setForm((prev) => ({
            ...prev,
            [name]: isNumberField ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = {
            ...form,
            startDate: form.startDate || undefined,
            notes: form.notes || undefined,
        };

        if (editingId) {
            dispatch(updateService({ ...payload, id: editingId }));
            setEditingId(null);
        } else {
            dispatch(createService(payload));
        }

        setForm(initialFormState);
    };

    const handleEdit = (service: Service) => {
        const editForm = {
            ...initialFormState, 
            ...service,
            startDate: service.startDate ? new Date(service.startDate).toISOString().split('T')[0] : "",
            notes: service.notes || "", 
        };
        setForm(editForm);
        setEditingId(service.id || null);
    };

    const handleDelete = (id?: string) => {
        if (id) dispatch(deleteService(id));
    };

    const handleViewDetails = (service: Service) => {
        setSelectedService(service);
    };

    const closePopup = () => {
        setSelectedService(null);
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const serviceFields: (keyof Omit<Service, 'id'>)[] = ["description", "estimatedDuration", "cost", "startDate", "notes"];

    const fieldLabels: { [key in keyof Omit<Service, 'id'>]: string } = {
        description: "Descrição do Orçamento",
        estimatedDuration: "Duração Estimada (ex: 2h)",
        cost: "Custo (R$)",
        startDate: "Data Previsão Início", 
        notes: "Observações (Opcional)"    
    };

    const getFieldType = (field: keyof Omit<Service, 'id'>) => {
        if (field === 'cost') return 'number';
        if (field === 'startDate') return 'date';
        return 'text';
    };

    return (
        <div className="sm:p-4">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 dark:text-green-300">
                Orçamentos de Serviços
            </h2>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6"
            >
                {serviceFields.map((field) => {
                    if (field === 'notes') return null;

                    return (
                        <div key={field} className="relative">
                            <input
                                type={getFieldType(field)} 
                                id={field}
                                name={field}
                                value={form[field] || ''}
                                onChange={handleChange}
                                required={field !== 'startDate' && field !== 'notes'} 
                                step={field === 'cost' ? '0.01' : undefined} 
                                placeholder={fieldLabels[field]}
                                className="peer h-10 w-full border border-green-400 dark:border-green-300 rounded-md bg-white dark:bg-black text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:border-orange-500 pl-3 pr-3 transition-colors"
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
                        onChange={handleChange as React.ChangeEventHandler<HTMLTextAreaElement>}
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
                    {editingId ? "Atualizar Orçamento" : "Cadastrar Orçamento"}
                </button>
            </form>

            <h3 className="font-semibold mb-3 text-gray-700 dark:text-green-300 text-sm sm:text-base">
                Orçamentos Cadastrados
            </h3>

            <div className="border max-w-[90vw] lg:max-w-full border-gray-300 dark:border-gray-700 rounded-lg w-full mt-4 mb-16 overflow-x-auto">
                <table className="table-fixed w-full border-collapse">
                    <thead>
                        <tr className="bg-green-500 dark:bg-green-900 text-gray-800 dark:text-white">
                            <th className="w-1/4 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">Descrição</th>
                            <th className="w-1/5 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">Duração</th>
                            <th className="hidden sm:table-cell w-1/5 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">
                                Custo
                            </th>
                            <th className="hidden sm:table-cell w-1/5 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">
                                Prev. Início
                            </th>
                            <th className="w-1/5 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedServices.length > 0 ? (
                            paginatedServices.map((service) => (
                                <tr
                                    key={service.id}
                                    className="dark:text-white hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
                                >
                                    <td className="text-xs sm:text-sm px-2 sm:px-4 py-2 border-b truncate align-top">{service.description}</td>
                                    <td className="text-xs sm:text-sm px-2 sm:px-4 py-2 border-b truncate align-top">{service.estimatedDuration}</td>
                                    <td className="hidden sm:table-cell text-xs sm:text-sm px-2 sm:px-4 py-2 border-b truncate align-top">
                                        {service.cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </td>
                                    <td className="hidden sm:table-cell text-xs sm:text-sm px-2 sm:px-4 py-2 border-b truncate align-top">
                                        {service.startDate ? new Date(service.startDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A'}
                                    </td>
                                    
                                    <td className="px-2 sm:px-4 py-3 border-b flex justify-start gap-3 sm:gap-4 whitespace-nowrap align-top">
                                        <button 
                                            onClick={() => handleViewDetails(service)} 
                                            className="text-gray-500 hover:text-blue-500"
                                            title="Visualizar Detalhes"
                                        >
                                            <FiEye />
                                        </button>
                                        <button 
                                            onClick={() => handleEdit(service)} 
                                            className="text-blue-500 hover:text-blue-700"
                                            title="Editar"
                                        >
                                            <FiEdit />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(service.id)} 
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
                                    {loading ? "Carregando..." : "Nenhum orçamento cadastrado"}
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

            {loading && services.length > 0 && (
                <p className="text-gray-500 dark:text-gray-300 mt-2 text-xs sm:text-sm">
                    Carregando...
                </p>
            )}

            {selectedService && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                    onClick={closePopup}
                >
                    <div 
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 max-w-lg text-gray-800 dark:text-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-green-300">{selectedService.description}</h3>
                            <button onClick={closePopup} className="text-gray-500 hover:text-red-500">
                                <FiX size={24} />
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            <p><strong>Duração Estimada:</strong> {selectedService.estimatedDuration}</p>
                            <p><strong>Custo:</strong> {selectedService.cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                            <p><strong>Previsão Início:</strong> {selectedService.startDate ? new Date(selectedService.startDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A'}</p>
                            <hr className="border-gray-300 dark:border-gray-600"/>
                            <p><strong>Observações:</strong></p>
                            <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md text-sm whitespace-pre-wrap">
                                {selectedService.notes || "Nenhuma observação."}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesForm;