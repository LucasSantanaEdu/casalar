'use client';

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    fetchEmployees, 
    createEmployee, 
    updateEmployee, 
    deleteEmployee, 
    Employee 
} from "@/store/employeesSlice";
import { FiTrash2, FiEdit, FiEye, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi"; 
import { AppDispatch, RootState } from "@/store";

const ITEMS_PER_PAGE = 10;

const initialFormState: Omit<Employee, 'id'> = {
    name: "",
    cpf: "",
    role: "",
    availability: "",
    email: "",
    phone: "" 
};

const EmployeesForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const allEmployees = useSelector((state: RootState) => state.employees?.data || []);
    const loading = useSelector((state: RootState) => state.employees?.loading || false);

    const [form, setForm] = useState(initialFormState);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const paginatedEmployees = allEmployees.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    const totalPages = Math.ceil(allEmployees.length / ITEMS_PER_PAGE);

    const employeeFields: (keyof Omit<Employee, 'id'>)[] = [
        "name", 
        "cpf",
        "role", 
        "availability", 
        "email", 
        "phone"
    ];

    const fieldLabels: { [key in keyof Omit<Employee, 'id'>]: string } = {
        name: "Nome Completo",
        cpf: "CPF (Opcional)",
        role: "Cargo (ex: Gerente, Técnico)",
        availability: "Disponibilidade (ex: Horário Comercial)",
        email: "Email (Opcional)",
        phone: "Telefone (Opcional)"
    };

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            cpf: form.cpf || undefined,
            email: form.email || undefined,
            phone: form.phone || undefined,
        };

        if (editingId) {
            dispatch(updateEmployee({ ...payload, id: editingId }));
            setEditingId(null);
        } else {
            dispatch(createEmployee(payload));
        }
        setForm(initialFormState);
    };

    const handleEdit = (employee: Employee) => {
        const editForm = {
            ...initialFormState,
            ...employee,
            cpf: employee.cpf || "",
            email: employee.email || "",
            phone: employee.phone || "",
        };
        setForm(editForm);
        setEditingId(employee.id || null);
    };

    const handleDelete = (id?: string) => {
        if (id) dispatch(deleteEmployee(id));
    };

    const handleViewDetails = (employee: Employee) => {
        setSelectedEmployee(employee);
    };

    const closePopup = () => {
        setSelectedEmployee(null);
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    return (
        <div className="sm:p-4">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 dark:text-green-300">
                Cadastro de Funcionários
            </h2>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6"
            >
                {employeeFields.map((field) => (
                    <div key={field} className="relative">
                        <input
                            type={field === 'email' ? 'email' : 'text'}
                            id={field}
                            name={field}
                            value={form[field] || ''}
                            onChange={handleChange}
                            required={field === 'name' || field === 'role' || field === 'availability'}
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
                ))}

                <button
                    type="submit"
                    className="sm:col-span-2 w-full bg-green-600 text-white dark:text-black py-2 rounded hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500 transition"
                >
                    {editingId ? "Atualizar Funcionário" : "Cadastrar Funcionário"}
                </button>
            </form>

            <h3 className="font-semibold mb-3 text-gray-700 dark:text-green-300 text-sm sm:text-base">
                Funcionários Cadastrados
            </h3>

            <div className="border max-w-[90vw] lg:max-w-full border-gray-300 dark:border-gray-700 rounded-lg w-full mt-4 mb-16 overflow-x-auto">
                <table className="table-fixed w-full border-collapse">
                    <thead>
                        <tr className="bg-green-500 dark:bg-green-900 text-gray-800 dark:text-white">
                            <th className="w-1/4 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">Nome</th>
                            <th className="w-1/5 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">Cargo</th>
                            <th className="hidden sm:table-cell w-1/5 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">
                                CPF
                            </th>
                            <th className="hidden sm:table-cell w-1/5 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">
                                Disponibilidade
                            </th>
                            <th className="hidden sm:table-cell w-1/5 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">
                                Contato
                            </th>
                            <th className="w-1/5 text-xs sm:text-sm px-2 sm:px-4 py-2 border-b text-start">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedEmployees.length > 0 ? (
                            paginatedEmployees.map((employee) => (
                                <tr
                                    key={employee.id}
                                    className="dark:text-white hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
                                >
                                    <td className="text-xs sm:text-sm px-2 sm:px-4 py-2 border-b truncate align-top">{employee.name}</td>
                                    <td className="text-xs sm:text-sm px-2 sm:px-4 py-2 border-b truncate align-top">{employee.role}</td>
                                    <td className="hidden sm:table-cell text-xs sm:text-sm px-2 sm:px-4 py-2 border-b truncate align-top">
                                        {employee.cpf || 'N/A'}
                                    </td>
                                    <td className="hidden sm:table-cell text-xs sm:text-sm px-2 sm:px-4 py-2 border-b truncate align-top">{employee.availability}</td>
                                    <td className="hidden sm:table-cell text-xs sm:text-sm px-2 sm:px-4 py-2 border-b truncate align-top">
                                        {employee.email || employee.phone || 'N/A'}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 border-b flex justify-start gap-3 sm:gap-4 whitespace-nowrap align-top">
                                        <button 
                                            onClick={() => handleViewDetails(employee)} 
                                            className="text-gray-500 hover:text-blue-500"
                                            title="Visualizar Detalhes"
                                        >
                                            <FiEye />
                                        </button>
                                        <button 
                                            onClick={() => handleEdit(employee)} 
                                            className="text-blue-500 hover:text-blue-700"
                                            title="Editar"
                                        >
                                            <FiEdit />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(employee.id)} 
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
                                <td colSpan={6} className="text-center px-2 sm:px-4 py-2 border-b text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                    {loading ? "Carregando..." : "Nenhum funcionário cadastrado"}
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

            {loading && allEmployees.length > 0 && (
                <p className="text-gray-500 dark:text-gray-300 mt-2 text-xs sm:text-sm">
                    Carregando...
                </p>
            )}

            {selectedEmployee && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                    onClick={closePopup}
                >
                    <div 
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 max-w-lg text-gray-800 dark:text-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-green-300">{selectedEmployee.name}</h3>
                            <button onClick={closePopup} className="text-gray-500 hover:text-red-500">
                                <FiX size={24} />
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            <p><strong>Cargo:</strong> {selectedEmployee.role}</p>
                            <p><strong>CPF:</strong> {selectedEmployee.cpf || "N/A"}</p>
                            <p><strong>Disponibilidade:</strong> {selectedEmployee.availability}</p>
                            <hr className="border-gray-300 dark:border-gray-600"/>
                            <p><strong>Email:</strong> {selectedEmployee.email || "N/A"}</p>
                            <p><strong>Telefone:</strong> {selectedEmployee.phone || "N/A"}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeesForm;