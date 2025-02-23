import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function Todo() {
  const [columns, setColumns] = useState([
    { id: "projects", title: "Projects", tasks: [] },
    { id: "assignments", title: "Assignments", tasks: [] },
    { id: "tests/quizzes", title: "Tests / Quizzes", tasks: [] },
    { id: "Other", title: "Other", tasks: [] },
  ]);

  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [taskInput, setTaskInput] = useState("");

  const handleDragEnd = (result) => {
    if (!result.destination) return;
  
    const { source, destination, type } = result;
  
    if (type === "COLUMN") {
      const reorderedColumns = [...columns];
      const [movedColumn] = reorderedColumns.splice(source.index, 1);
      reorderedColumns.splice(destination.index, 0, movedColumn);
      setColumns(reorderedColumns);
      return;
    }

    const updatedColumns = structuredClone(columns); // Avoid direct state mutation
    const sourceCol = updatedColumns.find((col) => col.id === source.droppableId);
    const destCol = updatedColumns.find((col) => col.id === destination.droppableId);
  
    if (!sourceCol || !destCol) return;
  
    const [movedTask] = sourceCol.tasks.splice(source.index, 1);
    destCol.tasks.splice(destination.index, 0, movedTask);
  
    setColumns(updatedColumns);
  };

  const addTask = (colId) => {
    if (!taskInput.trim()) return;
    setColumns((prev) =>
      prev.map((col) =>
        col.id === colId
          ? { 
              ...col, 
              tasks: [...col.tasks, { id: Date.now().toString(), text: taskInput, color: "bg-red-500" }] 
            }
          : col
      )
    );
    setTaskInput(""); // Clear input after adding
  };

  const changeTaskColor = (colId, taskId, color, e) => {
    e.stopPropagation(); // Prevent event bubbling for drag-drop

    setColumns((prev) =>
      prev.map((col) =>
        col.id === colId
          ? {
              ...col,
              tasks: col.tasks.map((task) =>
                task.id === taskId ? { ...task, color } : task
              ),
            }
          : col
      )
    );
  };

  const deleteTask = (colId, taskId) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === colId
          ? { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) }
          : col
      )
    );
  };

  const addColumn = () => {
    if (!newColumnTitle.trim()) return;
    setColumns((prev) => [
      ...prev,
      { id: Date.now().toString(), title: newColumnTitle, tasks: [] },
    ]);
    setNewColumnTitle("");
  };
  
  return (
    <div className="items-center justify-items-center w-1/2">
      <div className="flex gap-2 bg-gray-100 px-2 py-2 mb-4 w-full rounded">
        <input
          type="text"
          className="w-5/6 border p-2 rounded text-gray-800"
          placeholder="New Column Name"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
        />
        <button className="w-1/6 bg-blue-500 text-white p-2 font-bold rounded" onClick={addColumn}>
          Add Column
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="columns" direction="vertical" type="COLUMN">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col gap-4 w-full"
            >
              {columns.map((column, index) => (
                <Draggable key={column.id} draggableId={column.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-gray-100 p-4 rounded w-full"
                    >
                      <div 
                        {...provided.dragHandleProps} 
                        className="cursor-move bg-rose-900 py-1 px-2 border-4 border-rose-800 rounded text-white font-bold"
                      >
                        {column.title}
                      </div>

                      <Droppable droppableId={column.id} type="TASK">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="mt-2">
                            {column.tasks.map((task, taskIndex) => (
                              <Draggable key={task.id} draggableId={task.id} index={taskIndex}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`flex justify-between items-center p-2 my-2 rounded shadow ${task.color}`}
                                  >
                                    <p className="flex-1">{task.text}</p>
                                    
                                    {/* Color Selection Buttons */}
                                    <div className="flex gap-1 bg-gray-300 border-2 border-white rounded p-1 mr-1">
                                      <button 
                                        className="w-3 h-3 bg-green-500 rounded" 
                                        onClick={(e) => changeTaskColor(column.id, task.id, "bg-green-500", e)}
                                      />
                                      <button 
                                        className="w-3 h-3 bg-red-500 rounded" 
                                        onClick={(e) => changeTaskColor(column.id, task.id, "bg-red-500", e)}
                                      />
                                      <button 
                                        className="w-3 h-3 bg-blue-500 rounded" 
                                        onClick={(e) => changeTaskColor(column.id, task.id, "bg-blue-500", e)}
                                      />
                                    </div>
                              
                                    <button
                                      className="bg-red-500 text-white px-2 rounded hover:bg-red-600 transition"
                                      onClick={() => deleteTask(column.id, task.id)}
                                    >
                                      X
                                    </button>
                                  </div>
                                )}
                              </Draggable>                    
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      <div className="mt-2 flex gap-x-2">
                        <input
                          type="text"
                          className="border p-1 rounded w-2/3 text-gray-800"
                          placeholder="New Task"
                          value={taskInput}
                          onChange={(e) => setTaskInput(e.target.value)}
                        />
                        <button
                          className="bg-green-500 text-white p-1 rounded w-1/3 font-bold"
                          onClick={() => addTask(column.id)}
                        >
                          Add Task
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
