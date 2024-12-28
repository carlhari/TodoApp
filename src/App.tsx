/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import randomColor from "randomcolor";

function App() {
  const [todos, setTodos] = useState<any>(
    JSON.parse(localStorage.getItem("todos") || "[]")
  );

  const [editingId, setEditingId] = useState<number | null>(null); // Track specific ID being edited
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");

  const [isOpenDelete, setOpenDelete] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null); // Track the ID to be deleted
  const color = randomColor();

  useEffect(() => {
    const items = localStorage.getItem("todos");
    try {
      items ? setTodos(JSON.parse(items)) : setTodos([]);
    } catch (error) {
      console.error("Failed to load the To Do List", error);
      setTodos([]);
    }
  }, []);

  const Add = () => {
    const newTodo = {
      id: todos.length + 1,
      title: "Untitled",
      description: "Empty",
      color: randomColor({ luminosity: "light" }),
    };

    const updatedTodos = [...todos, newTodo];
    localStorage.setItem(`todos`, JSON.stringify(updatedTodos));
    setTodos(updatedTodos);

    const container = document.querySelector(".container-list");

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
    setTimeout(() => {
      container &&
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
    }, 10);
  };

  const toggleEditing = (id: number) => {
    setEditingId(editingId === id ? null : id);
    const todo = todos.find((todo: any) => todo.id === id);
    if (todo) {
      setNewTitle(todo.title);
      setNewDescription(todo.description);
    }
  };

  const updateTodo = (id: number) => {
    const updatedTodos = todos.map((todo: any) =>
      todo.id === id
        ? { ...todo, title: newTitle, description: newDescription }
        : todo
    );
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setTodos(updatedTodos);
    setEditingId(null);
  };

  const deleteTodo = (id: number) => {
    const updatedTodos = todos.filter((todo: any) => todo.id !== id);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setTodos(updatedTodos);
  };

  const DeleteOverlay = ({ id }: { id: number }) => {
    return (
      <div className="fixed w-full h-[100vh] bg-gray-200/50 flex items-center justify-center z-10">
        <div className="bg-white w-[30%] p-4 shadow-xl rounded-xl flex items-center justify-center flex-col">
          <h1 className="text-3xl text-center">
            {`  Are you sure you want to delete this task ID: ${id}?`}
          </h1>
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={() => {
                deleteTodo(id);
                setOpenDelete(false);
              }}
              className="px-4 text-2xl py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold"
            >
              Yes
            </button>
            <button
              onClick={() => setOpenDelete(false)}
              className="px-4 text-2xl py-2 bg-gray-300 text-black rounded hover:bg-gray-400 font-semibold"
            >
              No
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {isOpenDelete && deleteId !== null && <DeleteOverlay id={deleteId} />}
      <div className="w-full h-[100vh] flex flex-col px-8 py-4 gap-4">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-[#F90B0B] via-[#209C94] to-[#69B72B] bg-clip-text text-transparent">
            Sticky Wall
          </h1>
          <button
            onClick={() => {
              localStorage.clear();
              setTodos([]);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear
          </button>
        </div>
        <div className="container-list flex-1 border border-gray-300 rounded-lg p-4 shadow-md overflow-y-auto">
          <div className="columns-4 gap-4">
            {todos &&
              todos.map((todo: any) => (
                <div
                  key={todo.id}
                  className={`break-inside-avoid bg-${color} flex flex-col animate-fadeIn  rounded-lg p-4 shadow-sm break-words mb-4 min-h-[300px]`}
                  style={{ backgroundColor: todo.color }}
                >
                  <div className="flex items-center justify-end w-full mb-2">
                    <div className="flex items-center justify-between w-full gap-2">
                      <div className="text-lg font-semibold">Id: {todo.id}</div>

                      <div className="flex items-center gap-2">
                        <FaRegEdit
                          className="text-2xl cursor-pointer text-black"
                          onClick={() => toggleEditing(todo.id)}
                        />
                        <IoMdClose
                          className="text-2xl cursor-pointer text-black"
                          onClick={() => {
                            setDeleteId(todo.id);
                            setOpenDelete(true);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full ">
                    {editingId === todo.id ? (
                      <>
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full mb-2 p-2 border border-gray-300 rounded text-4xl font-semibold border-none outline-none"
                          maxLength={300}
                        />
                        <div className="w-full">
                          <textarea
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            className="w-full min-h-[200px] mb-2 p-2 border border-gray-300 rounded text-2xl border-none outline-none resize-none"
                            maxLength={300}
                          />

                          <div className="w-full">
                            {editingId === todo.id ? newDescription.length : 0}{" "}
                            / 300
                          </div>
                        </div>
                        <button
                          onClick={() => updateTodo(todo.id)}
                          className="px-1 bg-green-700 text-white rounded text-lg"
                        >
                          Update
                        </button>
                      </>
                    ) : (
                      <>
                        <h2 className="text-4xl font-semibold">{todo.title}</h2>
                        <p className="text-gray-700 text-2xl min-h-[200px]">
                          {todo.description}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            <div
              className="break-inside-avoid h-[300px] bg-gray-200 flex items-center justify-center rounded-lg p-4 cursor-pointer hover:bg-gray-300 mb-4 min-h-[150px]"
              onClick={Add}
            >
              <FaPlus className="text-3xl text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default App;
