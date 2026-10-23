// Array principal de chamados
let chamados = [
  { id: 1, titulo: "Computador não liga", descricao: "Sem sinal de energia", prioridade: "Alta", status: "Aberto" }
];

// Requisito 2: Array específico para prioridades
const prioridades = ["Baixa", "Média", "Alta"];

// Função da SPA para alternar as telas
function mudarTela(tela, id = null) {
  if (tela === "dashboard") renderizarDashboard();
  if (tela === "listagem") renderizarListagem();
  if (tela === "cadastro") renderizarCadastro();
  if (tela === "detalhes") renderizarDetalhes(id);
  if (tela === "encerramento") renderizarEncerramento(id);
}

// Requisito 1 & 7: Badges coloridas
function badgePrioridade(p) {
  if (p === "Alta") return `<span class="badge bg-danger piscar">Alta</span>`;
  if (p === "Média") return `<span class="badge bg-warning text-dark">Média</span>`;
  return `<span class="badge bg-success">Baixa</span>`;
}

function badgeStatus(s) {
  if (s === "Aberto") return `<span class="badge bg-primary">Aberto</span>`;
  if (s === "Em atendimento") return `<span class="badge bg-info text-dark">Em atendimento</span>`;
  return `<span class="badge bg-secondary">Encerrado</span>`;
}

// Requisito 8: Dashboard com valores calculados via filter()
function renderizarDashboard() {
  const total = chamados.length;
  const abertos = chamados.filter(c => c.status === "Aberto").length;
  const atendimento = chamados.filter(c => c.status === "Em atendimento").length;
  const encerrados = chamados.filter(c => c.status === "Encerrado").length;
  const altas = chamados.filter(c => c.prioridade === "Alta").length;

  document.getElementById("app").innerHTML = `
    <h2>Dashboard</h2>
    <div class="row text-center mt-3">
      <div class="col"><div class="card p-3"><h5>Total</h5><h3>${total}</h3></div></div>
      <div class="col"><div class="card p-3"><h5>Abertos</h5><h3>${abertos}</h3></div></div>
      <div class="col"><div class="card p-3"><h5>Em Atendimento</h5><h3>${atendimento}</h3></div></div>
      <div class="col"><div class="card p-3"><h5>Encerrados</h5><h3>${encerrados}</h3></div></div>
      <div class="col"><div class="card p-3"><h5>Prioridade Alta</h5><h3>${altas}</h3></div></div>
    </div>
  `;
}

// Requisito 3: Listagem com Coluna de Ações
function renderizarListagem() {
  let linhas = chamados.map(c => `
    <tr>
      <td>#${c.id}</td>
      <td>${c.titulo}</td>
      <td>${badgePrioridade(c.prioridade)}</td>
      <td>${badgeStatus(c.status)}</td>
      <td>
        <button class="btn btn-sm btn-info text-white" onclick="mudarTela('detalhes', ${c.id})">Visualizar</button>
        ${c.status !== "Encerrado" ? `<button class="btn btn-sm btn-danger" onclick="mudarTela('encerramento', ${c.id})">Encerrar</button>` : ""}
      </td>
    </tr>
  `).join("");

  document.getElementById("app").innerHTML = `
    <h2>Lista de Chamados</h2>
    <table class="table table-bordered bg-white mt-3">
      <thead><tr><th>ID</th><th>Título</th><th>Prioridade</th><th>Status</th><th>Ações</th></tr></thead>
      <tbody>${linhas}</tbody>
    </table>
  `;
}

// Requisito 2: Form montado dinamicamente a partir do array de prioridades
function renderizarCadastro() {
  let opts = prioridades.map(p => `<option value="${p}">${p}</option>`).join("");

  document.getElementById("app").innerHTML = `
    <h2>Novo Chamado</h2>
    <div class="card p-3 bg-white mt-3" style="max-width: 500px;">
      <div class="mb-2"><label>Título</label><input id="titulo" class="form-control"></div>
      <div class="mb-2"><label>Descrição</label><textarea id="descricao" class="form-control"></textarea></div>
      <div class="mb-2"><label>Prioridade</label><select id="prioridade" class="form-select">${opts}</select></div>
      <button class="btn btn-success mt-2" onclick="salvarChamado()">Salvar</button>
    </div>
  `;
}

function salvarChamado() {
  const tit = document.getElementById("titulo").value;
  const desc = document.getElementById("descricao").value;
  const prio = document.getElementById("prioridade").value;

  if (!tit || !desc) return alert("Preencha todos os campos!");

  chamados.push({
    id: chamados.length + 1,
    titulo: tit,
    descricao: desc,
    prioridade: prio,
    status: "Aberto"
  });

  mudarTela("listagem");
}

// Requisito 6: Tela de Detalhes
function renderizarDetalhes(id) {
  const c = chamados.find(item => item.id === id);
  document.getElementById("app").innerHTML = `
    <h2>Detalhes do Chamado #${c.id}</h2>
    <div class="card p-3 bg-white mt-3">
      <p><strong>Título:</strong> ${c.titulo}</p>
      <p><strong>Descrição:</strong> ${c.descricao}</p>
      <p><strong>Prioridade:</strong> ${badgePrioridade(c.prioridade)}</p>
      <p><strong>Status:</strong> ${badgeStatus(c.status)}</p>
      ${c.solucao ? `<p><strong>Solução:</strong> ${c.solucao}</p>` : ""}
      <button class="btn btn-secondary mt-2" onclick="mudarTela('listagem')">Voltar</button>
    </div>
  `;
}

// Requisito 4 & 9: Tela de Encerramento com Validação
function renderizarEncerramento(id) {
  const c = chamados.find(item => item.id === id);
  document.getElementById("app").innerHTML = `
    <h2>Encerrar Chamado #${c.id}</h2>
    <div class="card p-3 bg-white mt-3">
      <p><strong>Título:</strong> ${c.titulo}</p>
      <p><strong>Descrição:</strong> ${c.descricao}</p>
      <div class="mb-2">
        <label><strong>O que foi feito? (Obrigatório)</strong></label>
        <textarea id="solucao" class="form-control" rows="3"></textarea>
      </div>
      <button class="btn btn-danger" onclick="confirmarEncerramento(${c.id})">Confirmar Encerramento</button>
      <button class="btn btn-secondary" onclick="mudarTela('listagem')">Cancelar</button>
    </div>
  `;
}

// Requisito 5 & 9: Salva solução no objeto e muda status
function confirmarEncerramento(id) {
  const sol = document.getElementById("solucao").value.trim();
  
  if (!sol) {
    alert("O preenchimento do procedimento realizado é obrigatório!");
    return;
  }

  const c = chamados.find(item => item.id === id);
  c.status = "Encerrado";
  c.solucao = sol;

  mudarTela("listagem");
}

// Iniciar no Dashboard
mudarTela("dashboard");