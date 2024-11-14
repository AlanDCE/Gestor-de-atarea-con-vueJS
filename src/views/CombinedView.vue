<template>
    <div class="task-container">
        <h1>Lista de Tareas</h1>

        <div class="input-group">
            <input 
                v-model="newTask" 
                @keyup.enter="addTask" 
                placeholder="Añadir nueva tarea" 
                class="task-input"
            />
            <button @click="addTask" class="add-button">Añadir</button>
        </div>

        <div v-if="tasks.length > 0" class="task-list">
            <div v-for="task in tasks" :key="task.id" class="task-item">
                <span :class="{ completed: task.completed }">{{ task.todo }}</span>
                <div>
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
            newTask: "", // Campo de entrada para la nueva tarea
            tasks: [],   // Lista de tareas locales
        };
    },
    mounted() {
        this.fetchTasks();
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
        async addTask() {
            if (this.newTask.trim() === "") return;

            const newTask = {
                todo: this.newTask,
                completed: false,
            };

            try {
                const response = await fetch('http://localhost:3000/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newTask),
                });
                const addedTask = await response.json();
                this.tasks.unshift(addedTask);
                this.newTask = "";
            } catch (error) {
                console.error('Error al agregar la tarea:', error);
            }
        },
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
    },
};
</script>

<style scoped>
.task-container {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
}

.input-group {
    display: flex;
    margin-bottom: 10px;
}

.task-input {
    flex-grow: 1;
    padding: 8px;
    margin-right: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.add-button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
}

.task-list {
    margin-top: 20px;
}

.task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
}

.completed {
    text-decoration: line-through;
    color: gray;
}
</style>
