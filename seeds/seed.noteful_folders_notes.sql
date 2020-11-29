INSERT INTO noteful_folders (folder_name)
VALUES
  ( 'Groceries'),
  ('Hardware Store'),
  ('Others');

INSERT INTO noteful_notes (note_name, content, folder_id)
VALUES
  ('first note', 'potatoes recipe', 1),
  ('Second note', 'oranges recipe', 1),
  ('Third note', 'nails for Christmas tree', 2),
  ('Fourth note', 'electrical tape', 2);