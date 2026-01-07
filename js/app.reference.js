/**
 * Daily Performance Tracker
 * Clean vanilla JavaScript with backend integration in mind
 * Can easily integrate with PHP API or Supabase
 */

// ============================================
// STATE MANAGEMENT
// ============================================

const AppState = {
    tasks: [],
    streak: 0,
    lastActivityDate: null,

    /**
     * Initialize state from localStorage (frontend storage)
     * Later, this can be replaced with API calls to fetch from backend
     */
    init() {
        this.loadFromStorage();
        this.checkDayReset();
    },

    /**
     * Load data from localStorage
     * This is a placeholder for backend data fetching
     */
    loadFromStorage() {
        const stored = localStorage.getItem('performanceTrackerData');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                this.tasks = data.tasks || [];
                this.streak = data.streak || 0;
                this.lastActivityDate = data.lastActivityDate || null;
            } catch (error) {
                console.error('Error loading data from storage:', error);
                this.resetToDefaults();
            }
        } else {
            this.resetToDefaults();
        }
    },

    /**
     * Save data to localStorage
     * Later, this can be replaced with API calls to save to backend
     */
    saveToStorage() {
        const data = {
            tasks: this.tasks,
            streak: this.streak,
            lastActivityDate: this.lastActivityDate,
        };
        localStorage.setItem('performanceTrackerData', JSON.stringify(data));
    },

    /**
     * Reset to default state
     */
    resetToDefaults() {
        this.tasks = [];
        this.streak = 0;
        this.lastActivityDate = null;
    },

    /**
     * Check if a new day has started and reset tasks accordingly
     */
    checkDayReset() {
        const today = this.getTodayString();
        
        if (this.lastActivityDate !== today) {
            // New day detected
            this.resetDayTasks();
            this.lastActivityDate = today;
            this.saveToStorage();
        }
    },

    /**
     * Reset task completion for a new day
     */
    resetDayTasks() {
        // Check if all tasks were completed yesterday
        const allCompletedYesterday = this.tasks.length > 0 && 
            this.tasks.every(task => task.completed);
        
        // Increment streak if all tasks were completed
        if (allCompletedYesterday) {
            this.streak++;
        } else {
            this.streak = 0;
        }

        // Reset all task completion status
        this.tasks.forEach(task => {
            task.completed = false;
        });
    },

    /**
     * Get today's date as a string (YYYY-MM-DD)
     */
    getTodayString() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    },

    /**
     * Add a new task
     * @param {string} text - The task text
     * @returns {object} - The created task
     */

    /**
 * Task Model (v1)
 * - id: unique identifier (frontend-generated for now)
 * - text: task description
 * - completed: daily completion state
 * - createdAt: ISO string
 */
    
    addTask(text) {
        if (!text || text.trim() === '') {
            console.warn('Cannot add empty task');
            return null;
        }

        const task = {
            id: Date.now(), // Simple ID generation (can be replaced with UUID later)
            text: text.trim(),
            completed: false,
            createdAt: new Date().toISOString(),
        };

        this.tasks.push(task);
        this.saveToStorage();
        return task;
    },

    /**
     * Toggle task completion status
     * @param {number} taskId - The task ID
     */
    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveToStorage();
        }
    },

    /**
     * Delete a task
     * @param {number} taskId - The task ID
     */
    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveToStorage();
    },

    /**
     * Clear all tasks
     */
    clearAllTasks() {
        this.tasks = [];
        this.saveToStorage();
    },

    /**
     * Calculate completion percentage
     * @returns {number} - Percentage from 0-100
     */
    getCompletionPercentage() {
        if (this.tasks.length === 0) return 0;
        const completed = this.tasks.filter(t => t.completed).length;
        return Math.round((completed / this.tasks.length) * 100);
    },

    /**
     * Get task statistics
     * @returns {object} - Stats object
     */
    getStats() {
        return {
            total: this.tasks.length,
            completed: this.tasks.filter(t => t.completed).length,
            percentage: this.getCompletionPercentage(),
            streak: this.streak,
        };
    },
};

// ============================================
// DOM SELECTORS & REFS
// ============================================

const DOM = {
    currentDate: document.getElementById('currentDate'),
    completionPercentage: document.getElementById('completionPercentage'),
    streakCount: document.getElementById('streakCount'),
    taskCount: document.getElementById('taskCount'),
    taskInput: document.getElementById('taskInput'),
    addTaskBtn: document.getElementById('addTaskBtn'),
    tasksList: document.getElementById('tasksList'),
    emptyState: document.getElementById('emptyState'),
    resetDayBtn: document.getElementById('resetDayBtn'),
    clearAllBtn: document.getElementById('clearAllBtn'),
    progressRingFill: document.querySelector('.progress-ring-fill'),
};

// ============================================
// UI RENDERING
// ============================================

const UI = {
    /**
     * Update the current date display
     */
    updateDate() {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = today.toLocaleDateString('en-US', options);
        DOM.currentDate.textContent = dateString;
    },

    /**
     * Update performance metrics display
     */
    updatePerformanceMetrics() {
        const stats = AppState.getStats();
        
        // Update percentage
        DOM.completionPercentage.textContent = `${stats.percentage}%`;
        
        // Update progress ring
        this.updateProgressRing(stats.percentage);
        
        // Update streak
        DOM.streakCount.textContent = stats.streak;
        
        // Update task count
        DOM.taskCount.textContent = `${stats.completed} of ${stats.total}`;
    },

    /**
     * Update the progress ring SVG
     * @param {number} percentage - Completion percentage
     */
    updateProgressRing(percentage) {
        if (!DOM.progressRingFill) return;
        
        const radius = 54;
        const circumference = radius * 2 * Math.PI; // ~339.29
        const strokeDashoffset = circumference - (percentage / 100) * circumference;
        
        DOM.progressRingFill.style.strokeDashoffset = strokeDashoffset;
    },

    /**
     * Render all tasks in the DOM
     */
    renderTasks() {
        DOM.tasksList.innerHTML = '';
        
        if (AppState.tasks.length === 0) {
            DOM.emptyState.classList.add('show');
            return;
        }
        
        DOM.emptyState.classList.remove('show');
        
        AppState.tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            DOM.tasksList.appendChild(taskElement);
        });
    },

    /**
     * Create a single task DOM element
     * @param {object} task - The task object
     * @returns {HTMLElement} - The task element
     */
    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.taskId = task.id;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', `Mark "${task.text}" as complete`);
        checkbox.addEventListener('change', () => this.handleTaskToggle(task.id));
        
        const label = document.createElement('label');
        label.className = 'task-label';
        label.textContent = task.text;
        label.addEventListener('click', (e) => {
            if (e.target === label) {
                checkbox.checked = !checkbox.checked;
                this.handleTaskToggle(task.id);
            }
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'task-delete';
        deleteBtn.innerHTML = '×';
        deleteBtn.setAttribute('aria-label', `Delete "${task.text}"`);
        deleteBtn.addEventListener('click', () => this.handleTaskDelete(task.id));
        
        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(deleteBtn);
        
        return li;
    },

    /**
     * Refresh the entire UI
     */
    refresh() {
        this.updateDate();
        this.updatePerformanceMetrics();
        this.renderTasks();
    },
};

// ============================================
// EVENT HANDLERS
// ============================================

const EventHandlers = {
    /**
     * Handle adding a new task
     */
    handleAddTask() {
        const text = DOM.taskInput.value;
        
        if (text.trim() === '') {
            console.warn('Task text is empty');
            return;
        }
        
        AppState.addTask(text);
        DOM.taskInput.value = '';
        DOM.taskInput.focus();
        
        UI.refresh();
    },

    /**
     * Handle task completion toggle
     * @param {number} taskId - The task ID
     */
    handleTaskToggle(taskId) {
        AppState.toggleTask(taskId);
        UI.refresh();
    },

    /**
     * Handle task deletion
     * @param {number} taskId - The task ID
     */
    handleTaskDelete(taskId) {
        AppState.deleteTask(taskId);
        UI.refresh();
    },

    /**
     * Handle manual day reset
     */
    handleResetDay() {
        if (confirm('Reset the day? All task completions will be reset.')) {
            AppState.resetDayTasks();
            AppState.saveToStorage();
            UI.refresh();
        }
    },

    /**
     * Handle clearing all tasks
     */
    handleClearAll() {
        if (confirm('Are you sure you want to delete all tasks?')) {
            AppState.clearAllTasks();
            UI.refresh();
        }
    },

    /**
     * Handle Enter key in task input
     * @param {KeyboardEvent} event - The keyboard event
     */
    handleTaskInputKeydown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.handleAddTask();
        }
    },
};

// ============================================
// INITIALIZATION
// ============================================

function init() {
    // Initialize app state
    AppState.init();
    
    // Initial UI render
    UI.refresh();
    
    // Attach event listeners
    DOM.addTaskBtn.addEventListener('click', () => EventHandlers.handleAddTask());
    DOM.taskInput.addEventListener('keydown', (e) => EventHandlers.handleTaskInputKeydown.call(EventHandlers, e));
    DOM.resetDayBtn.addEventListener('click', () => EventHandlers.handleResetDay());
    DOM.clearAllBtn.addEventListener('click', () => EventHandlers.handleClearAll());
    
    // Optional: Log initialization
    console.log('Daily Performance Tracker initialized');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================
// BACKEND INTEGRATION HELPERS
// ============================================

/**
 * These functions are prepared for backend integration.
 * They can be used later to connect with PHP API or Supabase.
 * 
 * Example usage:
 * 
 * // Fetch tasks from backend
 * const tasks = await API.fetchTasks();
 * AppState.tasks = tasks;
 * 
 * // Save task to backend
 * const newTask = AppState.addTask('My task');
 * await API.createTask(newTask);
 * 
 * // Update task on backend
 * await API.updateTask(taskId, { completed: true });
 */

const API = {
    /**
     * Base configuration for API calls
     * Update these when implementing backend integration
     */
    config: {
        // Example PHP backend
        // baseURL: 'http://localhost/api',
        // headers: { 'Content-Type': 'application/json' }
        
        // Example Supabase
        // baseURL: 'https://your-project.supabase.co/rest/v1',
        // headers: {
        //   'Content-Type': 'application/json',
        //   'Authorization': 'Bearer YOUR_SUPABASE_KEY'
        // }
    },

    /**
     * Fetch all tasks from backend
     * @returns {Promise<Array>} - Array of tasks
     */
    async fetchTasks() {
        // Placeholder for backend API call
        // Example PHP:
        // const response = await fetch(`${this.config.baseURL}/tasks`);
        // return response.json();
        
        // Example Supabase:
        // const response = await fetch(
        //   `${this.config.baseURL}/tasks`,
        //   { headers: this.config.headers }
        // );
        // return response.json();
        
        console.log('API.fetchTasks() - To be implemented with backend');
        return [];
    },

    /**
     * Create a new task on backend
     * @param {object} task - The task object
     * @returns {Promise<object>} - Created task with backend ID
     */
    async createTask(task) {
        // Placeholder for backend API call
        // Example PHP:
        // const response = await fetch(
        //   `${this.config.baseURL}/tasks`,
        //   {
        //     method: 'POST',
        //     headers: this.config.headers,
        //     body: JSON.stringify(task)
        //   }
        // );
        // return response.json();
        
        console.log('API.createTask() - To be implemented with backend', task);
        return task;
    },

    /**
     * Update task on backend
     * @param {number} taskId - The task ID
     * @param {object} updates - Fields to update
     * @returns {Promise<object>} - Updated task
     */
    async updateTask(taskId, updates) {
        // Placeholder for backend API call
        // Example PHP:
        // const response = await fetch(
        //   `${this.config.baseURL}/tasks/${taskId}`,
        //   {
        //     method: 'PUT',
        //     headers: this.config.headers,
        //     body: JSON.stringify(updates)
        //   }
        // );
        // return response.json();
        
        console.log('API.updateTask() - To be implemented with backend', taskId, updates);
        return { id: taskId, ...updates };
    },

    /**
     * Delete task from backend
     * @param {number} taskId - The task ID
     * @returns {Promise<void>}
     */
    async deleteTask(taskId) {
        // Placeholder for backend API call
        // Example PHP:
        // await fetch(
        //   `${this.config.baseURL}/tasks/${taskId}`,
        //   { method: 'DELETE', headers: this.config.headers }
        // );
        
        console.log('API.deleteTask() - To be implemented with backend', taskId);
    },

    /**
     * Fetch user stats from backend
     * @returns {Promise<object>} - Stats object
     */
    async fetchStats() {
        // Placeholder for backend API call
        console.log('API.fetchStats() - To be implemented with backend');
        return AppState.getStats();
    },

    /**
     * Save streak to backend
     * @param {number} streak - Current streak count
     * @returns {Promise<object>} - Updated streak data
     */
    async saveStreak(streak) {
        // Placeholder for backend API call
        console.log('API.saveStreak() - To be implemented with backend', streak);
        return { streak };
    },
};
