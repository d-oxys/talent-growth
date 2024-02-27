'use client';
import { useState, useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionActions from '@mui/material/AccordionActions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion } from '@mui/material';
import { styled } from '@mui/system';
import { TextField, Button } from '@mui/material';
import { Modal, Box, Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';

type Todo = {
  title: string;
  description?: string;
  deadline?: string;
  category?: string;
  isCompleted: boolean;
};

const TodoApp: React.FC = () => {
  const theme = useTheme();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const CompletedAccordion = styled(Accordion)(({ theme }) => ({
    backgroundColor: '#00A65A',
  }));

  const IncompleteAccordion = styled(Accordion)(({ theme }) => ({
    backgroundColor: '#D61F3B',
  }));
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Load todos from localStorage when component mounts
  useEffect(() => {
    const storedValue = localStorage.getItem('todos');
    if (storedValue) {
      setTodos(JSON.parse(storedValue));
    }
  }, []);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (title !== '') {
      const sameTitleCount = todos.filter((todo) => todo.title.startsWith(title)).length;
      const uniqueTitle = sameTitleCount > 0 ? `${title} #${sameTitleCount + 1}` : title;
      const newTodos = [...todos, { title: uniqueTitle, description, deadline, category, isCompleted: false }];
      setTodos(newTodos);
      localStorage.setItem('todos', JSON.stringify(newTodos));
      setTitle('');
      setDescription('');
      setDeadline('');
      setCategory('');
      handleClose(); // Tutup modal
      toast.success('Todo berhasil ditambahkan');
    } else {
      toast.error('Judul tidak boleh kosong');
    }
  };

  const deleteTask = (title: string) => {
    const index = todos.findIndex((todo) => todo.title === title);
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
    toast.success('todo berhasil di hapus');
  };

  const completeTask = (title: string) => {
    const index = todos.findIndex((todo) => todo.title === title);
    const newTodos = [...todos];
    newTodos[index].isCompleted = true;
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
    toast.success('todo berhasil di selesaikan');
  };

  const uncompleteTask = (title: string) => {
    const index = todos.findIndex((todo) => todo.title === title);
    const newTodos = [...todos];
    newTodos[index].isCompleted = false;
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
    toast.success('todo berhasil di batalkan');
  };

  return (
    <>
      <ToastContainer />
      <div className='mx-auto min-h-screen max-w-5xl px-4 py-10'>
        <div className='relative mb-4 flex items-center justify-center text-center'>
          <h1 className='text-center text-2xl font-bold capitalize text-black md:text-6xl'>Todo List</h1>
        </div>
        <div className='flex justify-start'>
          <div className='mb-4'>
            <Button onClick={handleOpen} className='rounded-text-xs mb-4 me-2 w-full bg-blue-700 px-5 py-2.5 text-xs font-medium text-white hover:bg-blue-800 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700'>
              Add Task
            </Button>
          </div>
        </div>

        <Modal open={open} onClose={handleClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
          <Box
            className='overflow-y-auto'
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', md: '500px' },
              maxHeight: '90vh',
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <form onSubmit={addTask} className='mb-4 flex flex-col'>
              <TextField value={title} onChange={(e) => setTitle(e.target.value)} label='Title' variant='outlined' className='mb-4' />
              <TextField value={description} onChange={(e) => setDescription(e.target.value)} label='Description (optional)' variant='outlined' multiline className='mb-4' />
              <TextField
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                label='Deadline (optional)'
                type='date'
                variant='outlined'
                className='mb-4'
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField value={category} onChange={(e) => setCategory(e.target.value)} label='Category (optional)' variant='outlined' className='mb-4' />
              <Button type='submit' variant='contained' color='primary' className='text-primary font-bold hover:text-white'>
                <p>Add Task</p>
              </Button>
            </form>
          </Box>
        </Modal>

        <div>
          <div className='cardHeader'>Tugas yang belum Selesai</div>
          <div className='bookshelf min-h-48'>
            {todos
              .filter((todo) => !todo.isCompleted)
              .map((todo, index) => (
                <IncompleteAccordion key={`${todo.title}-${index}`} className='mb-1'>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index}-content`} id={`panel${index}-header`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <h2 className='text-xs font-bold text-white md:text-base'>{todo.title}</h2>
                      {todo.deadline && <p className={`text-grey-darkest mr-2 hidden text-xs font-semibold md:block md:text-base ${todo.isCompleted ? 'text-white' : 'text-white'}`}>Deadline: {todo.deadline}</p>}
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>{todo.description && <p className={`text-grey-darkest text-xs md:text-base ${todo.isCompleted ? 'text-white' : 'text-white'}`}>{todo.description}</p>}</AccordionDetails>
                  <AccordionActions>
                    {!todo.isCompleted ? (
                      <Button className='text-white no-underline' onClick={() => completeTask(todo.title)}>
                        <p className='text-xs text-white no-underline md:text-base'>Complete</p>
                      </Button>
                    ) : (
                      <Button className='text-white no-underline' onClick={() => uncompleteTask(todo.title)}>
                        <p className='text-xs text-white no-underline md:text-base'>Uncomplete</p>
                      </Button>
                    )}
                    <Button onClick={() => deleteTask(todo.title)}>
                      <p className='text-xs text-white no-underline md:text-base'>Delete</p>
                    </Button>
                  </AccordionActions>
                </IncompleteAccordion>
              ))}
          </div>

          <div className='cardHeader border2'>Tugas yang Sudah Selesai</div>
          <div className='bookshelf min-h-48'>
            {todos
              .filter((todo) => todo.isCompleted)
              .map((todo, index) => (
                <CompletedAccordion key={`${todo.title}-${index}`} className='mb-1'>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index}-content`} id={`panel${index}-header`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <h2 className='text-xs font-bold text-white md:text-base'>{todo.title}</h2>
                      {todo.deadline && <p className={`text-grey-darkest mr-2 hidden text-xs font-semibold md:block md:text-base ${todo.isCompleted ? 'text-white' : 'text-white'}`}>Deadline: {todo.deadline}</p>}
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>{todo.description && <p className={`text-grey-darkest text-xs md:text-base ${todo.isCompleted ? 'text-white' : 'text-white'}`}>{todo.description}</p>}</AccordionDetails>
                  <AccordionActions>
                    {!todo.isCompleted ? (
                      <Button className='text-white no-underline' onClick={() => completeTask(todo.title)}>
                        <p className='text-xs text-white no-underline md:text-base'>Complete</p>
                      </Button>
                    ) : (
                      <Button className='text-white no-underline' onClick={() => uncompleteTask(todo.title)}>
                        <p className='text-xs text-white no-underline md:text-base'>Uncomplete</p>
                      </Button>
                    )}
                    <Button onClick={() => deleteTask(todo.title)}>
                      <p className='text-xs text-white no-underline md:text-base'>Delete</p>
                    </Button>
                  </AccordionActions>
                </CompletedAccordion>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TodoApp;
