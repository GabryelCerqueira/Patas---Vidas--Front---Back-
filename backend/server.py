import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import modulos

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend"))

app = Flask(__name__, static_folder=FRONTEND_DIR)
CORS(app)

modulos.criar_tabelas()
modulos.popular_dados_iniciais()

@app.route("/api", methods=["GET"])
def api_status():
    return jsonify({
        "status": "online",
        "sistema": "Patas & Vidas - Backend API (CRUD Animais)",
        "tabela": "animais (1. Identificação Básica do Animal Resgatado)",
        "banco": "SQLite3 (BancodeDadosGrupo6AlexsanderPedroHenriqueMuriloLemosGabryelCerqueira.db)",
        "endpoints": {
            "listar_todos": "GET /animais ou GET /resgates",
            "consultar_id": "GET /animais/<id>",
            "cadastrar": "POST /animais",
            "atualizar": "PUT /animais/<id>",
            "excluir": "DELETE /animais/<id>",
            "filtro": "GET /animais/filtro?q=<termo>&especie=<especie>&sexo=<sexo>"
        }
    })

# Rota principal: se acessado pelo navegador e existir frontend, abre o principal.html; senão retorna status da API
@app.route("/", methods=["GET"])
def index():
    if os.path.exists(os.path.join(FRONTEND_DIR, "principal.html")):
        return send_from_directory(FRONTEND_DIR, "principal.html")
    elif os.path.exists(os.path.join(FRONTEND_DIR, "index.html")):
        return send_from_directory(FRONTEND_DIR, "index.html")
    return api_status()

# Rotas de arquivos estáticos do frontend (para quando o frontend for servido via Flask)
@app.route("/<path:caminho>", methods=["GET"])
def servir_frontend(caminho):
    # Se for uma das rotas da API, deixa o Flask tratar nas funções abaixo
    if caminho in ["animais", "resgates", "consultar", "inserir", "apagar", "alterar", "api"] or caminho.startswith(("animais/", "resgates/")):
        return jsonify({"erro": "Rota não encontrada"}), 404

    arquivo = os.path.join(FRONTEND_DIR, caminho)
    if os.path.isfile(arquivo):
        diretorio = os.path.dirname(arquivo)
        nome = os.path.basename(arquivo)
        return send_from_directory(diretorio, nome)
    return jsonify({"erro": f"Arquivo estático '{caminho}' não encontrado"}), 404

# --- ROTAS DA API CRUD ---

@app.route("/animais", methods=["GET"])
@app.route("/resgates", methods=["GET"])
def listar_animais():
    try:
        ordem = request.args.get("ordem", "DESC")
        dados = modulos.consultar(ordem=ordem)
        return jsonify(dados), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@app.route("/animais/<int:id_registro>", methods=["GET"])
@app.route("/resgates/<int:id_registro>", methods=["GET"])
def obter_animal(id_registro):
    try:
        registro = modulos.consultar_por_id(id_registro)
        if registro:
            return jsonify(registro), 200
        return jsonify({"erro": "Animal não encontrado"}), 404
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@app.route("/animais", methods=["POST"])
@app.route("/resgates", methods=["POST"])
def cadastrar_animal():
    try:
        if request.is_json:
            dados = request.get_json()
        elif request.form:
            dados = request.form.to_dict()
        else:
            dados = request.args.to_dict()

        if not dados:
            return jsonify({"erro": "Nenhum dado recebido no formulário"}), 400

        novo_id = modulos.inserir(dados)
        return jsonify({
            "mensagem": "Animal cadastrado com sucesso no banco de dados!",
            "id": novo_id,
            "cod_animal": novo_id
        }), 201
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@app.route("/animais/<int:id_registro>", methods=["DELETE"])
@app.route("/resgates/<int:id_registro>", methods=["DELETE"])
def excluir_animal(id_registro):
    try:
        sucesso = modulos.apagar(id_registro)
        if sucesso:
            return jsonify({
                "mensagem": f"Animal #{id_registro} excluído com sucesso do banco de dados!",
                "id": id_registro
            }), 200
        return jsonify({"erro": "Animal não encontrado para exclusão"}), 404
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@app.route("/animais/<int:id_registro>", methods=["PUT", "POST"])
@app.route("/resgates/<int:id_registro>", methods=["PUT", "POST"])
def atualizar_animal(id_registro):
    try:
        if request.is_json:
            dados = request.get_json()
        elif request.form:
            dados = request.form.to_dict()
        else:
            dados = request.args.to_dict()

        sucesso = modulos.alterar(id_registro, dados)
        if sucesso:
            return jsonify({
                "mensagem": f"Animal #{id_registro} atualizado com sucesso!",
                "id": id_registro
            }), 200
        return jsonify({"erro": "Animal não encontrado para alteração"}), 404
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@app.route("/animais/filtro", methods=["GET"])
@app.route("/resgates/filtro", methods=["GET"])
def filtrar_animais():
    try:
        termo = request.args.get("q", "")
        especie = request.args.get("especie", "")
        sexo = request.args.get("sexo", "")
        resultados = modulos.consultarFiltroTermo(termo=termo, especie=especie, sexo=sexo)
        return jsonify(resultados), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

# --- ROTAS DO SLIDE ACADÊMICO ---

@app.route("/consultar", methods=["GET"])
def rota_consultar_slide():
    dados = modulos.consultar()
    return jsonify(dados), 200

@app.route("/inserir", methods=["GET", "POST"])
def rota_inserir_slide():
    dados = request.get_json() if request.is_json else (request.form.to_dict() or request.args.to_dict())
    novo_id = modulos.inserir(dados)
    return jsonify({"mensagem": "Inserido com sucesso!", "id": novo_id}), 201

@app.route("/apagar", methods=["GET", "DELETE"])
def rota_apagar_slide():
    id_registro = request.args.get("id", type=int)
    if not id_registro:
        return jsonify({"erro": "Parâmetro 'id' é obrigatório"}), 400
    sucesso = modulos.apagar(id_registro)
    return jsonify({"sucesso": sucesso}), 200

@app.route("/alterar", methods=["GET", "POST", "PUT"])
def rota_alterar_slide():
    dados = request.get_json() if request.is_json else (request.form.to_dict() or request.args.to_dict())
    id_reg = dados.get("id") or dados.get("cod_animal")
    if not id_reg:
        return jsonify({"erro": "Parâmetro 'id' é obrigatório"}), 400
    sucesso = modulos.alterar(int(id_reg), dados)
    return jsonify({"sucesso": sucesso}), 200

if __name__ == "__main__":
    host = os.environ.get("HOST", "0.0.0.0")
    porta = int(os.environ.get("PORT", 8000))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() in ("true", "1", "t")
    print(f"[*] Servidor iniciado em http://{host}:{porta} (Debug={debug})")
    app.run(host=host, port=porta, debug=debug)
