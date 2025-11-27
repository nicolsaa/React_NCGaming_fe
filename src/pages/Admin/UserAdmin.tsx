import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
    active: boolean;
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        const saved = localStorage.getItem("users");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                const normalized: User[] = parsed
                    .filter((u: any) => u && u.id)
                    .map((u: any) => {
                        let role: "ADMIN" | "USER" = "USER";
                        if (typeof u.role === "string" && u.role.toUpperCase() === "ADMIN") {
                            role = "ADMIN";
                        }

                        return {
                            id: u.id,
                            name: u.name || "Usuario sin nombre",
                            email: u.email || "Sin email",
                            active: Boolean(u.active),
                            role: role,
                        };
                    });

                setUsers(normalized);
            } catch (error) {
                console.error("Error parsing users:", error);
            }
        }

        setLoading(false);
    };

    const saveUsers = (list: User[]) => {
        localStorage.setItem("users", JSON.stringify(list));
        setUsers(list);
    };

    const toggleActive = (id: string) => {
        saveUsers(
            users.map((u) =>
                u.id === id ? { ...u, active: !u.active } : u
            )
        );
    };

    const changeRole = (id: string) => {
        saveUsers(
            users.map((u) =>
                u.id === id
                    ? { ...u, role: u.role === "ADMIN" ? "USER" : "ADMIN" }
                    : u
            )
        );
    };

    const deleteUser = (id: string) => {
        if (!confirm("¿Eliminar usuario permanentemente?")) return;

        saveUsers(users.filter((u) => u.id !== id));
    };

    if (loading) {
        return <div className="p-10 text-lg font-semibold">Cargando usuarios...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="container mx-auto px-4">

                {/* HEADER igual al Admin */}
                <Card className="mb-6 border-0 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            Administración de Usuarios
                        </CardTitle>
                        <p className="text-gray-600 mt-1">
                            Gestiona roles, estados y datos de los usuarios
                        </p>
                    </CardHeader>
                </Card>

                {/* LISTADO DE USERS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                        <Card key={user.id} className="border-0 shadow-xl">
                            <CardContent className="p-6">

                                {/* NOMBRE */}
                                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                                <p className="text-gray-600">{user.email}</p>

                                {/* BADGES */}
                                <div className="flex gap-2 mt-3">
                                    <Badge
                                        className={
                                            user.role === "ADMIN"
                                                ? "bg-purple-600 text-white"
                                                : "bg-gray-600 text-white"
                                        }
                                    >
                                        {user.role}
                                    </Badge>

                                    <Badge
                                        className={
                                            user.active
                                                ? "bg-green-600 text-white"
                                                : "bg-red-600 text-white"
                                        }
                                    >
                                        {user.active ? "Activo" : "Inactivo"}
                                    </Badge>
                                </div>

                                {/* BOTONES */}
                                <div className="flex flex-col gap-2 mt-6">
                                    <Button
                                        size="sm"
                                        className="w-full"
                                        onClick={() => toggleActive(user.id)}
                                    >
                                        {user.active ? "Desactivar" : "Activar"}
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => changeRole(user.id)}
                                    >
                                        Cambiar a {user.role === "ADMIN" ? "USER" : "ADMIN"}
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => deleteUser(user.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </div>

                            </CardContent>
                        </Card>
                    ))}

                    {/* SI NO HAY USERS */}
                    {users.length === 0 && (
                        <Card className="border-0 shadow-xl col-span-full text-center py-10">
                            <CardContent>
                                <h3 className="text-lg font-semibold text-gray-700">
                                    No hay usuarios registrados
                                </h3>
                                <p className="text-gray-500 mt-1">
                                    Se mostrarán aquí cuando existan usuarios en el sistema
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
