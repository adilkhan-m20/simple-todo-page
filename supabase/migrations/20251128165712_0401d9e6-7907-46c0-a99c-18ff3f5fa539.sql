-- Enable Row Level Security on todos table
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read all todos
CREATE POLICY "Allow public read access" 
ON public.todos 
FOR SELECT 
USING (true);

-- Create policy to allow anyone to insert todos
CREATE POLICY "Allow public insert access" 
ON public.todos 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to update todos
CREATE POLICY "Allow public update access" 
ON public.todos 
FOR UPDATE 
USING (true);

-- Create policy to allow anyone to delete todos
CREATE POLICY "Allow public delete access" 
ON public.todos 
FOR DELETE 
USING (true);