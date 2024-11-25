import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const app = express();
const porta = 3000;
const host = 'localhost';

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
        secret: 'chave-secreta',
        resave: false,
        saveUninitialized: true,
        cookie: { 
            secure: false,   
            httpOnly: true,
            maxAge: 1000 * 60 * 30
        }
    })
);

let produtos = [];

function menu(req, res) {
    const lastAccess = req.cookies.lastAccess
        ? `<p class="text-muted">Último acesso: ${req.cookies.lastAccess}</p>`
        : '';
    
    res.send(`
        <html>
            <head>
                <title>Atividade 4 - PPI</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                <style>
                        .body {
                        background-color: red;
                    }
                    </style>
            </head>
            <body>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="#">MENU</a>
                        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div class="navbar-nav">
                                <a class="nav-link active" aria-current="page" href="/login">Login</a>
                                <a class="nav-link active" aria-current="page" href="/produtos">Produtos</a> 
                            </div>
                        </div>
                    </div>
                </nav>
                ${lastAccess}
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </html>
    `);
}
function paginaLogin(req, res) {

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <div class="container w-25 mt-5">
                <form action='/login' method='POST' class="row g-3 needs-validation" novalidate>
                    <fieldset class="border p-2">
                        <legend class="mb-3">Autenticação do Sistema</legend>
                        <div class="col-md-12">
                            <label for="usuario" class="form-label">Usuário:</label>
                            <input type="text" class="form-control" id="usuario" name="usuario" required>
                        </div>
                        <div class="col-md-12">
                            <label for="senha" class="form-label">Senha</label>
                            <input type="password" class="form-control" id="senha" name="senha" required>
                        </div>
                        <div class="col-12 mt-2">
                            <button class="btn btn-primary" type="submit">Login</button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </body>
        </html>
    `);
}

function validarLogin(req, res) {
    const { usuario, senha } = req.body;

    if (usuario === "adm" && senha === "123") {
        req.session.usuario = usuario;
        res.cookie('lastAccess', new Date().toLocaleString());
        res.redirect('/produtos');
    } else {
        res.send(`
            <head>
            <meta charset="utf-8">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <div class="container w-50 mt-5">
                    <div class="alert alert-danger" role="alert">
                        Usuário ou senha inválidos!
                    </div>
                    <a href="/login" class="btn btn-secondary">Tentar novamente</a>
                </div>
            </body>
        `);
    }
}

function paginaProdutos(req, res) {
    if (!req.session.usuario) {
        res.send(`
            <head>
            <meta charset="utf-8">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <div class="container w-50 mt-5">
                    <div class="alert alert-warning" role="alert">
                        Você precisa fazer login para acessar a página.
                    </div>
                    <a href="/login" class="btn btn-secondary">Login</a>
                </div>
            </body>
        `);
        return;
    }

    res.send(`
        <head>
            <meta charset="utf-8">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
        <h2 style="text-align: center">Cadastro de Produtos</h2>
            <div class="container w-25 mt-5">
                <form method="POST" action="/produtos">
                    <div class="mb-3">
                        <label for="codigo" class="form-label">Código de Barras</label>
                        <input type="text" class="form-control form-control-sm" id="codigo" name="codigo" required>
                    </div>
                    <div class="mb-3">
                        <label for="descricao" class="form-label">Descrição</label>
                        <input type="text" class="form-control form-control-sm" id="descricao" name="descricao" required>
                    </div>
                    <div class="mb-3">
                        <label for="precoCusto" class="form-label">Preço de Custo</label>
                        <input type="text" class="form-control form-control-sm" id="precoCusto" name="precoCusto" required>
                    </div>
                    <div class="mb-3">
                        <label for="precoVenda" class="form-label">Preço de Venda</label>
                        <input type="text" class="form-control form-control-sm" id="precoVenda" name="precoVenda" required>
                    </div>
                    <div class="mb-3">
                        <label for="validade" class="form-label">Data de Validade</label>
                        <input type="date" class="form-control form-control-sm" id="validade" name="validade" required>
                    </div>
                    <div class="mb-3">
                        <label for="estoque" class="form-label">Quantidade em Estoque</label>
                        <input type="number" class="form-control form-control-sm" id="estoque" name="estoque" required>
                    </div>
                    <div class="mb-3">
                        <label for="fabricante" class="form-label">Nome do Fabricante</label>
                        <input type="text" class="form-control form-control-sm" id="fabricante" name="fabricante" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Cadastrar Produto</button>
                </form>
                <hr>
            </div>
            <div class="container w-75 mt-5">
                <h2>Produtos Cadastrados</h2>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Descrição</th>
                            <th>Preço Custo</th>
                            <th>Preço Venda</th>
                            <th>Validade</th>
                            <th>Estoque</th>
                            <th>Fabricante</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${produtos
                            .map(
                                (produto) => `
                            <tr>
                                <td>${produto.codigo}</td>
                                <td>${produto.descricao}</td>
                                <td>${produto.precoCusto}</td>
                                <td>${produto.precoVenda}</td>
                                <td>${produto.validade}</td>
                                <td>${produto.estoque}</td>
                                <td>${produto.fabricante}</td>
                            </tr>
                        `
                            )
                            .join('')}
                    </tbody>
                </table>
            </div>
        </body>
    `);
}

function cadastrarProduto(req, res) {
    const { codigo, descricao, precoCusto, precoVenda, validade, estoque, fabricante } = req.body;
    produtos.push({ codigo, descricao, precoCusto, precoVenda, validade, estoque, fabricante });
    res.redirect('/produtos');
}

app.get('/', menu);
app.get('/login', paginaLogin);
app.post('/login', validarLogin);
app.get('/produtos', paginaProdutos);
app.post('/produtos', cadastrarProduto);

app.listen(porta, host, () => {
    console.log(`Servidor iniciado em http://${host}:${porta}`);
});
