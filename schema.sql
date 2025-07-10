-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL -- senha deve ser criptografada com bcrypt
);

-- Inserir um usuário admin com a senha "123456" (criptografada)
-- A senha abaixo é: bcrypt.hashSync("123456", 10)
INSERT INTO usuarios (usuario, senha)
VALUES ('admin', '$2b$10$OCaE5zVeqv1s5IXzi1LwXey3De3GmGeNf6X9B6M9YtaRwuh65ElXK')
ON CONFLICT (usuario) DO NOTHING;

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- Tabela de perguntas
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(id),
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
