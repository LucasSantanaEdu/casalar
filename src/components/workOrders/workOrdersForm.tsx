'use client';

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    fetchWorkOrders, 
    createWorkOrder, 
    updateWorkOrder, 
    deleteWorkOrder, 
    WorkOrder 
} from "@/store/workOrdersSlice";
import { fetchCustomers } from "@/store/customersSlice";
import { fetchEmployees } from "@/store/employeesSlice";
import { fetchServices } from "@/store/servicesSlice";
import { fetchTools } from "@/store/toolsSlice";

import { FiTrash2, FiEdit, FiEye, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { AppDispatch, RootState } from "@/store";

const ITEMS_PER_PAGE = 10;

const initialFormState: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'> = {
    customerId: "",
    employees: [], 
    services: [],  
    tools: [],    
    startDate: "",
    endDate: "",
    status: 'Pending',
    notes: ""
};

const statusTranslations: Record<string, string> = {
    'Pending': 'Pendente',
    'Scheduled': 'Agendado',
    'In Progress': 'Em Progresso',
    'Completed': 'Concluída'
};

const WorkOrdersForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    const workOrders = useSelector((state: RootState) => state.workOrders?.data || []);
    const customers = useSelector((state: RootState) => state.customers?.data || []);
    const employees = useSelector((state: RootState) => state.employees?.data || []);
    const services = useSelector((state: RootState) => state.services?.data || []);
    const tools = useSelector((state: RootState) => state.tools?.data || []);
    
    const loading = useSelector((state: RootState) => state.workOrders?.loading || false);

    const [form, setForm] = useState(initialFormState);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const sortedCustomers = [...customers].sort((a, b) => a.name.localeCompare(b.name));
    const sortedEmployees = [...employees].sort((a, b) => a.name.localeCompare(b.name));
    
    const sortedServices = [...services].sort((a, b) => (a.id || '').localeCompare(b.id || ''));
    const sortedTools = [...tools].sort((a, b) => (a.id || '').localeCompare(b.id || ''));

    const paginatedWorkOrders = workOrders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    const totalPages = Math.ceil(workOrders.length / ITEMS_PER_PAGE);

    const fieldLabels = {
        customerId: "Cliente",
        employees: "Funcionários Responsáveis",
        services: "Serviços a Realizar",
        tools: "Ferramentas Necessárias",
        startDate: "Data de Início",
        endDate: "Data de Término",
        status: "Status",
        notes: "Observações"
    };

    useEffect(() => {
        dispatch(fetchWorkOrders());
        dispatch(fetchCustomers());
        dispatch(fetchEmployees());
        dispatch(fetchServices());
        dispatch(fetchTools());
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, options } = e.target;
        const selectedValues: string[] = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedValues.push(options[i].value);
            }
        }
        setForm((prev) => ({
            ...prev,
            [name]: selectedValues
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = {
            ...form,
            startDate: form.startDate || undefined,
            endDate: form.endDate || undefined,
            notes: form.notes || undefined,
        };

        if (editingId) {
            dispatch(updateWorkOrder({ ...payload, id: editingId }));
            setEditingId(null);
        } else {
            dispatch(createWorkOrder(payload));
        }
        setForm(initialFormState);
    };

    const handleEdit = (workOrder: WorkOrder) => {
        const editForm = {
            ...initialFormState,
            ...workOrder,
            startDate: workOrder.startDate ? new Date(workOrder.startDate).toISOString().split('T')[0] : "",
            endDate: workOrder.endDate ? new Date(workOrder.endDate).toISOString().split('T')[0] : "",
            notes: workOrder.notes || "",
        };
        setForm(editForm);
        setEditingId(workOrder.id || null);
    };

    const handleDelete = (id?: string) => {
        if (id) dispatch(deleteWorkOrder(id));
    };

    const handleViewDetails = (order: WorkOrder) => {
        setSelectedWorkOrder(order);
    };

    const closePopup = () => {
        setSelectedWorkOrder(null);
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const getCustomerName = (id: string) => customers.find(c => c.id === id)?.name || id;
    const getEmployeeNames = (ids: string[]) => ids.map(id => employees.find(e => e.id === id)?.name || id).join(', ');
    const getServiceNames = (ids: string[]) => ids.map(id => services.find(s => s.id === id)?.description || id).join(', ');
    const getToolNames = (ids: string[]) => ids.map(id => tools.find(t => t.id === id)?.name || id).join(', ');

    return (
        <div className="sm:p-4">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 dark:text-green-300">
                Cadastro de Ordens de Serviço
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6">
                
                <div className="relative">
                    <select 
                        id="customerId" 
                        name="customerId" 
                        value={form.customerId} 
                        onChange={handleChange} 
                        required 
                        className="peer h-10 w-full border border-green-400 dark:border-green-300 rounded-md bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 pl-2 pr-3 transition-colors"
                    >
                        <option value="">Selecione um Cliente</option>
                        {sortedCustomers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                                {customer.name}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="customerId" className="absolute left-3 -top-6 text-gray-700 dark:text-green-300 text-sm">
                        {fieldLabels.customerId}
                    </label>
                </div>

                <div className="relative">
                    <select id="status" name="status" value={form.status} onChange={handleChange} required
                        className="peer h-10 w-full border border-green-400 dark:border-green-300 rounded-md bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 pl-2 pr-3 transition-colors">
                        <option value="Pending">Pendente</option>
                        <option value="Scheduled">Agendado</option>
                        <option value="In Progress">Em Progresso</option>
                        <option value="Completed">Concluída</option>
                    </select>
                    <label htmlFor="status" className="absolute left-3 -top-6 text-gray-700 dark:text-green-300 text-sm">
                        {fieldLabels.status}
                    </label>
                </div>

                <div className="relative">
                    <input type="date" id="startDate" name="startDate" value={form.startDate} onChange={handleChange}
                        className="peer h-10 w-full border border-green-400 dark:border-green-300 rounded-md bg-white dark:bg-black text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:border-orange-500 pl-3 pr-3 transition-colors" />
                    <label htmlFor="startDate" className="absolute left-3 -top-6 text-gray-700 dark:text-green-300 text-sm">
                        {fieldLabels.startDate}
                    </label>
                </div>

                <div className="relative">
                    <input type="date" id="endDate" name="endDate" value={form.endDate} onChange={handleChange}
                        className="peer h-10 w-full border border-green-400 dark:border-green-300 rounded-md bg-white dark:bg-black text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:border-orange-500 pl-3 pr-3 transition-colors" />
                    <label htmlFor="endDate" className="absolute left-3 -top-6 text-gray-700 dark:text-green-300 text-sm">
                        {fieldLabels.endDate}
                    </label>
                </div>

                <div className="relative">
                    <select 
                        multiple 
                        id="employees" 
                        name="employees" 
                        value={form.employees} 
                        onChange={handleMultiSelectChange} 
                        required 
                        className="peer h-24 w-full border border-green-400 dark:border-green-300 rounded-md bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 pl-2 pr-3 py-2 transition-colors text-sm"
                    >
                        {sortedEmployees.map((emp) => (
                            <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                        ))}
                    </select>
                    <label htmlFor="employees" className="absolute left-3 -top-6 text-gray-700 dark:text-green-300 text-sm">
                        {fieldLabels.employees} <span className="text-xs text-gray-500">(Segure Ctrl para selecionar vários)</span>
                    </label>
                </div>

                <div className="relative">
                    <select 
                        multiple 
                        id="services" 
                        name="services" 
                        value={form.services} 
                        onChange={handleMultiSelectChange} 
                        required 
                        className="peer h-24 w-full border border-green-400 dark:border-green-300 rounded-md bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 pl-2 pr-3 py-2 transition-colors text-sm"
                    >
                        {sortedServices.map((svc) => (
                            <option key={svc.id} value={svc.id}>{svc.description} - R$ {svc.cost}</option>
                        ))}
                    </select>
                    <label htmlFor="services" className="absolute left-3 -top-6 text-gray-700 dark:text-green-300 text-sm">
                        {fieldLabels.services} <span className="text-xs text-gray-500">(Segure Ctrl)</span>
                    </label>
                </div>

                <div className="relative sm:col-span-2">
                    <select 
                        multiple 
                        id="tools" 
                        name="tools" 
                        value={form.tools} 
                        onChange={handleMultiSelectChange} 
                        required 
                        className="peer h-24 w-full border border-green-400 dark:border-green-300 rounded-md bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 pl-2 pr-3 py-2 transition-colors text-sm"
                    >
                        {sortedTools.map((tool) => (
                            <option key={tool.id} value={tool.id}>{tool.name} - {tool.availability}</option>
                        ))}
                    </select>
                    <label htmlFor="tools" className="absolute left-3 -top-6 text-gray-700 dark:text-green-300 text-sm">
                        {fieldLabels.tools} <span className="text-xs text-gray-500">(Segure Ctrl para selecionar vários)</span>
                    </label>
                </div>

                <div className="relative sm:col-span-2">
                    <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} placeholder={fieldLabels.notes}
                        className="peer h-20 w-full border border-green-400 dark:border-green-300 rounded-md bg-white dark:bg-black text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:border-orange-500 pl-3 pt-2 transition-colors" />
                    <label htmlFor="notes" className="absolute left-3 -top-6 text-gray-700 dark:text-green-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-green-300 peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-orange-500">
                        {fieldLabels.notes}
                    </label>
                </div>

                <button type="submit" className="sm:col-span-2 w-full bg-green-600 text-white dark:text-black py-2 rounded hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500 transition">
                    {editingId ? "Atualizar Ordem" : "Criar Ordem"}
                </button>
            </form>

            <h3 className="font-semibold mb-3 text-gray-700 dark:text-green-300 text-sm sm:text-base">
                Ordens Cadastrados
            </h3>

            <div className="border max-w-[90vw] lg:max-w-full border-gray-300 dark:border-gray-700 rounded-lg w-full mt-4 mb-16 overflow-x-auto">
                <table className="table-fixed w-full border-collapse">
                    <thead>
                        <tr className="bg-green-500 dark:bg-green-900 text-gray-800 dark:text-white">
                            <th className="w-1/5 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">Cliente</th>
                            <th className="w-1/5 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">Status</th>
                            <th className="hidden sm:table-cell w-1/5 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">Data Início</th>
                            <th className="hidden sm:table-cell w-1/4 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">Serviços</th>
                            <th className="w-1/5 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedWorkOrders.length > 0 ? (
                            paginatedWorkOrders.map((order) => (
                                <tr key={order.id} className="dark:text-white hover:bg-green-100 dark:hover:bg-green-800 transition-colors">
                                    <td className="text-xs sm:text-sm px-2 sm:px-4 py-2 border-b truncate align-top">
                                        {getCustomerName(order.customerId)}
                                    </td>
                                    <td className="text-xs sm:text-sm px-2 sm:px-4 py-2 border-b truncate align-top">
                                        {statusTranslations[order.status] || order.status}
                                    </td>
                                    <td className="hidden sm:table-cell text-xs sm:text-sm px-2 sm:px-4 py-2 border-b truncate align-top">
                                        {order.startDate ? new Date(order.startDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A'}
                                    </td>
                                    <td className="hidden sm:table-cell text-xs sm:text-sm px-2 sm:px-4 py-2 border-b truncate align-top">
                                        {getServiceNames(order.services)}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 border-b flex justify-start gap-3 sm:gap-4 whitespace-nowrap align-top">
                                        <button 
                                            onClick={() => handleViewDetails(order)} 
                                            className="text-gray-500 hover:text-blue-500"
                                            title="Visualizar Detalhes"
                                        >
                                            <FiEye />
                                        </button>
                                        <button 
                                            onClick={() => handleEdit(order)} 
                                            className="text-blue-500 hover:text-blue-700"
                                            title="Editar"
                                        >
                                            <FiEdit />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(order.id)} 
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
                                    {loading ? "Carregando..." : "Nenhuma ordem de serviço cadastrada"}
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

            {loading && workOrders.length > 0 && (
                <p className="text-gray-500 dark:text-gray-300 mt-2 text-xs sm:text-sm">
                    Carregando...
                </p>
            )}

            {selectedWorkOrder && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                    onClick={closePopup}
                >
                    <div 
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 max-w-lg text-gray-800 dark:text-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-green-300">Detalhes da OS (ID: {selectedWorkOrder.id})</h3>
                            <button onClick={closePopup} className="text-gray-500 hover:text-red-500">
                                <FiX size={24} />
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            <p><strong>Cliente:</strong> {getCustomerName(selectedWorkOrder.customerId)}</p>
                            <p><strong>Status:</strong> {statusTranslations[selectedWorkOrder.status] || selectedWorkOrder.status}</p>
                            <hr className="border-gray-300 dark:border-gray-600"/>
                            <p><strong>Data Início:</strong> {selectedWorkOrder.startDate ? new Date(selectedWorkOrder.startDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A'}</p>
                            <p><strong>Data Término:</strong> {selectedWorkOrder.endDate ? new Date(selectedWorkOrder.endDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A'}</p>
                            <hr className="border-gray-300 dark:border-gray-600"/>
                            <p><strong>Funcionários:</strong> {getEmployeeNames(selectedWorkOrder.employees) || "Nenhum"}</p>
                            <p><strong>Serviços:</strong> {getServiceNames(selectedWorkOrder.services) || "Nenhum"}</p>
                            <p><strong>Ferramentas:</strong> {getToolNames(selectedWorkOrder.tools) || "Nenhuma"}</p>
                            <hr className="border-gray-300 dark:border-gray-600"/>
                            <p><strong>Observações:</strong></p>
                            <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md text-sm whitespace-pre-wrap">
                                {selectedWorkOrder.notes || "Nenhuma observação."}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkOrdersForm;