import './App.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import { Trash, Pencil } from 'react-bootstrap-icons';
import { useEffect, useRef, useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [task, setTask] = useState(
    () => {
      const savedTasks = localStorage.getItem("tasks");
      if (savedTasks) {
        return JSON.parse(savedTasks);
      } else {
        return [];
      }
    }
  );
  const [taskExist, setTaskExist] = useState(false);
  const [enterTask, setEnterTask] = useState(false);
  const [editedIndex, setEditedIndex] = useState(-1);
  const inputRef = useRef(null);

  const handleSetInput = (e) => {
    setInput(e.target.value);
  };

  const handleSetTask = () => {
    if (editedIndex >= 0) {
      const updatedTasks = task.map((item, index) => {
        if (index === editedIndex) {
          return input.trim();
        }
        return item;
      });
      if (task.some((item, index) => index !== editedIndex && item === input.trim())) {
        setTaskExist(true);
        return;
      }
      setTask(updatedTasks);
      setInput('');
      setEditedIndex(-1);
      setTaskExist(false);
      return;
    }
  
    // Add new task if not editing
    setTaskExist(false);
    setEnterTask(false);
    if (!input.trim()) {
      setEnterTask(true);
      return;
    }
    if (task.some(item => item === input.trim())) {
      setTaskExist(true);
      return;
    }
    setTask([...task, input.trim()]);
    setInput('');
    inputRef.current.focus();
  };

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSetTask();
    }
  };

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(task))
  }, [task]);

  const handleDeleteTask = (index) => {
    const updatedTask = task.filter((_, i) => i !== index);
    setTask(updatedTask);
  };

  const handleEditTask = (singleTask, index) => {
    inputRef.current.focus();
    setInput(singleTask);
    setEditedIndex(index);
  };

  const handleDeleteAllTask = () => {
    setTask([]);
  };

  return (
    <div className="p-4 p-md-5">
      <Col sm={6} className='mx-auto'>
        <div className='border border-black mx-auto rounded-2 p-4'>
          <h1 className='text-center mb-3'>To Do</h1>
          <Form>
            <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Enter Task</Form.Label>
              <Col xs="9">
                <Form.Control
                  type="text"
                  placeholder="Ex. Learn react"
                  value={input}
                  onKeyDown={handleEnterPress}
                  onChange={handleSetInput}
                  ref={inputRef}
                />
              </Col>
              <Col xs="3" className='ps-0'>
                <Button className='w-100' onClick={handleSetTask}>Add</Button>
              </Col>
              <Col sm="12">
                {taskExist && <p className='mt-2 text-danger'>Task already exists!</p>}
                {enterTask && <p className='mt-2 text-danger'>Please enter a task!</p>}              
              </Col>
            </Form.Group>
          </Form>
          <h4 className='mt-4'>Your ToDo List</h4>
          <ListGroup>
            {task.map((singleTask, index) => (
              <ListGroup.Item className='d-flex align-items-center' key={index}>
                {index + 1}. {singleTask}
                <Button
                  variant="primary"
                  className='ms-auto'
                  style={{ fontSize: "12px" }}
                  onClick={() => handleEditTask(singleTask, index)}
                >
                  <Pencil />
                </Button>
                <Button
                  variant="danger"
                  className='ms-2'
                  style={{ fontSize: "12px" }}
                  onClick={() => handleDeleteTask(index)}
                >
                  <Trash />
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
          {task.length > 0 && 
            <Button
              variant="danger"
              className='mx-auto d-flex mt-3'
              style={{ fontSize: "12px" }}
              onClick={handleDeleteAllTask}
            >
              Delete All
            </Button>
          }
        </div>
      </Col>
    </div>
  );
}

export default App;
