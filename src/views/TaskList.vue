<template>
    <div class="task-container">
        <h1>Lista de Tareas</h1>
        <button @click="fetchTasks">Cargar Tareas</button>

        <div v-if="tasks.length > 0">
            <div v-for="task in tasks" :key="task.id" class="task-item">
                <div>
                    <h5 :style="{ textDecoration: task.completed ? 'line-through' : 'none' }">{{ task.todo }}</h5>
                    <span>{{ task.completed ? 'Completada' : 'Pendiente' }}</span>
                    <button @click="toggleTaskCompletion(task)">
                        {{ task.completed ? 'Desmarcar' : 'Completar' }}
                    </button>
                    <button @click="deleteTask(task)">Eliminar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "TaskList",
    data() {
        return {
            tasks: [], // Almacenamiento local de las tareas traídas de la API
        };
    },
    methods: {
        async fetchTasks() {
            try {
                const response = await fetch('http://localhost:3000/tasks');
                const data = await response.json();
                this.tasks = data;
            } catch (error) {
                console.error('Error al obtener las tareas:', error);
            }
        },
        // Cambiar el estado de una tarea (completada/no completada)
        async toggleTaskCompletion(task) {
            try {
                task.completed = !task.completed;
                await fetch(`http://localhost:3000/tasks/${task.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ completed: task.completed }),
                });
            } catch (error) {
                console.error('Error al actualizar la tarea:', error);
            }
        },
        // Eliminar la tarea seleccionada
        async deleteTask(task) {
            try {
                await fetch(`http://localhost:3000/tasks/${task.id}`, {
                    method: 'DELETE',
                });
                this.tasks = this.tasks.filter((t) => t.id !== task.id);
            } catch (error) {
                console.error('Error al eliminar la tarea:', error);
            }
        },
    },
};
</script>

<style scoped>
.task-container {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
}

.task-item {
    margin-top: 10px;
}

button {
    margin-right: 5px;
}
</style>
