document.addEventListener('DOMContentLoaded', () => {
    const queueList = document.getElementById('queue-list');
    const queueSelect = document.getElementById('queue-select');
    const goButton = document.getElementById('go-button');
    const queueResponse = document.getElementById('queue-response');
    const addQueueForm = document.getElementById('add-queue-form');
    const addMessageForm = document.getElementById('add-message-form');

    async function fetchQueues() {
        try {
            const response = await fetch('/api/queues/info');
            const queues = await response.json();
            renderQueues(queues);
            updateQueueSelect(queues);
        } catch (error) {
            console.error('Error fetching queues:', error);
        }
    }

    function renderQueues(queues) {
        queueList.innerHTML = queues.map(queue => 
            `<li class="queue-item">${queue.name} (${queue.size} messages)</li>`
        ).join('');
    }

    function updateQueueSelect(queues) {
        queueSelect.innerHTML = '<option value="">Select a queue</option>' + 
            queues.map(queue => `<option value="${queue.name}">${queue.name}</option>`).join('');
    }

    async function fetchQueueResponse(queueName) {
        try {
            const response = await fetch(`/api/${queueName}`);
            const message = await response.json();
            queueResponse.textContent = JSON.stringify(message, null, 2);
        } catch (error) {
            console.error('Error fetching queue response:', error);
            queueResponse.textContent = 'Error fetching queue response';
        }
    }

    async function addQueue(queueName) {
        try {
            await fetch(`/api/${queueName}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: 'Initial message' })
            });
            fetchQueues();
        } catch (error) {
            console.error('Error adding queue:', error);
        }
    }

    async function addMessage(queueName, message) {
        try {
            await fetch(`/api/${queueName}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            fetchQueues();
        } catch (error) {
            console.error('Error adding queue:', error);
        }
    }

    goButton.addEventListener('click', async () => {
        const selectedQueue = queueSelect.value;
        if (selectedQueue) {
            await fetchQueueResponse(selectedQueue);
        } else {
            queueResponse.textContent = 'Please select a queue';
        }
    });

    addQueueForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const queueName = e.target.elements['new-queue-name'].value;
        await addQueue(queueName);
        e.target.reset();
    });

    addMessageForm.addEventListener('submit', async (e) => {    
        e.preventDefault();
        const message = e.target.elements['new-message'].value;
        await addMessage(queueSelect, message);
        e.target.reset();
    });

    fetchQueues();
});