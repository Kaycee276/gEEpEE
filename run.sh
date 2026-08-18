#!/bin/bash
echo "===================================================="
echo " Starting gEEpEE Agent Backend & Frontend Dashboard"
echo "===================================================="

# Kill any previous background processes on port 8000 or 5173 if running
fuser -k 8000/tcp 2>/dev/null
fuser -k 5173/tcp 2>/dev/null

# Start Backend Server
echo "Starting FastAPI Backend Server on http://localhost:8000..."
python3 backend/server.py &
BACKEND_PID=$!

# Start Frontend Dev Server
echo "Starting Vite Frontend Dashboard on http://localhost:5173..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo "----------------------------------------------------"
echo "gEEpEE is running!"
echo "Backend API:  http://localhost:8000"
echo "Frontend UI:  http://localhost:5173"
echo "Press Ctrl+C to stop."
echo "----------------------------------------------------"

wait $BACKEND_PID $FRONTEND_PID
