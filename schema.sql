-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL, -- senha deve ser criptografada com bcrypt
    reset_token VARCHAR,
    reset_token_expires TIMESTAMP
);

-- Inserir um usuário admin com a senha "123456" (criptografada)
-- A senha abaixo é: bcrypt.hashSync("123456", 10)
INSERT INTO usuarios (usuario, email, senha)
VALUES ('admin', 'aline.lima@icomp.com.br', '$2b$10$OCaE5zVeqv1s5IXzi1LwXey3De3GmGeNf6X9B6M9YtaRwuh65ElXK')
ON CONFLICT (usuario) DO NOTHING;

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Tabela de perguntas
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attachments (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    filepath TEXT NOT NULL,
    mimetype VARCHAR(100) NOT NULL,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS suggestions ( 
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    ip_address VARCHAR(45), -- para controle de spam ou rate limit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS question_categories (
  question_id INT REFERENCES questions(id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(id),
  PRIMARY KEY (question_id, category_id)
);

