# FoodApp / RangoJá

Uma aplicação de estudos que envolve back end e front end.

a ideia é ser um app estilo ifood

## Tecnologias

### Backend

- Postgresql

- GraphQl

- Prisma ORM

- Apollo server

### Front End

(A definir)

- React

## Dot Env

Criar dentro das pastas de cada instancia ./server/.env e ./client/.env

### Backend

```dotenv
DATABASE_URL=postgresql://user:root@db:5432/rangoja
JWT_SECRET=supersecretkey 
```

### FrontEnd

## Docker

### Pré-requisitos

- Docker
- Docker Compose

### Instruções para rodar a aplicação com Docker

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/delkz/rangoja.git
   cd rangoja

2. **Configure os arquivos `.env**`: Certifique-se de criar os arquivos `.env` para o back-end e o front-end, conforme descrito acima.

3. **Build e execução da aplicação**: Execute o Docker Compose para iniciar os serviços:
   ```bash
   docker-compose up --build

4.  **Acessar a aplicação**:

    - O back-end estará disponível em: http://localhost:4000
    - O front-end estará disponível em: http://localhost:3000