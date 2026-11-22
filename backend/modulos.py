import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_ENV = os.environ.get("DATABASE_PATH")
if DB_ENV:
    DB_NAME = os.path.abspath(DB_ENV)
else:
    db_files = [f for f in os.listdir(BASE_DIR) if f.endswith('.db')]
    DB_NAME = os.path.join(BASE_DIR, db_files[0]) if db_files else os.path.join(BASE_DIR, "BancodeDadosGrupo6AlexsanderPedroHenriqueMuriloLemosGabryelCerqueira.db")

def conectar():
    con = sqlite3.connect(DB_NAME)
    con.row_factory = sqlite3.Row
    return con

def criar_tabelas():
    con = conectar()
    cur = con.cursor()

    cur.execute('''
        CREATE TABLE IF NOT EXISTS animais (
            cod_animal INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_provisorio_animal TEXT NOT NULL,
            especie_animal TEXT NOT NULL,
            sexo_animal TEXT NOT NULL,
            idade_animal TEXT,
            peso_animal TEXT,
            cor_pelagem_animal TEXT,
            microchip_animal TEXT
        )
    ''')

    con.commit()
    cur.close()
    con.close()

def _formatar_linha(linha):
    if not linha:
        return None
    r = dict(linha)
    cod = r.get("cod_animal")
    nome = r.get("nome_provisorio_animal", "")
    especie = r.get("especie_animal", "")
    sexo = r.get("sexo_animal", "")
    idade = r.get("idade_animal", "")
    peso = r.get("peso_animal", "")
    pelagem = r.get("cor_pelagem_animal", "")
    microchip = r.get("microchip_animal") or ""

    return {
        "id": cod,
        "cod_animal": cod,
        "nome_provisorio": nome,
        "nome_provisorio_animal": nome,
        "especie": especie,
        "especie_animal": especie,
        "sexo": sexo,
        "sexo_animal": sexo,
        "idade_estimada": idade,
        "idade_animal": idade,
        "porte_peso": peso,
        "peso_animal": peso,
        "pelagem": pelagem,
        "cor_pelagem_animal": pelagem,
        "microchip": microchip,
        "microchip_animal": microchip
    }

def popular_dados_iniciais():
    con = conectar()
    cur = con.cursor()
    cur.execute("SELECT COUNT(*) FROM animais")
    total = cur.fetchone()[0]

    if total < 5:
        iniciais = [
            ("Pipoca", "canino", "macho", "adulto", "Médio (14 kg)", "Curta, caramelo e dourado", "981098102938102"),
            ("Luna", "felino", "femea", "jovem", "Pequeno (3.5 kg)", "Curta, branca com manchas pretas", "981098102938103"),
            ("Thor", "canino", "macho", "adulto", "Grande (26 kg)", "Densa, preta e marrom", "981098102938105"),
            ("Mel", "canino", "femea", "filhote", "Filhote (4.2 kg)", "Ondulada, dourada clara", "981098102938107"),
            ("Frederico", "felino", "macho", "adulto", "Médio (4.8 kg)", "Curta, rajado cinza", "981098102938109")
        ]

        cur.execute("SELECT nome_provisorio_animal FROM animais")
        nomes_existentes = {r[0] for r in cur.fetchall()}

        for nome, esp, sexo, idade, peso, pelagem, chip in iniciais:
            if nome not in nomes_existentes:
                cur.execute('''
                    INSERT INTO animais (nome_provisorio_animal, especie_animal, sexo_animal, idade_animal, peso_animal, cor_pelagem_animal, microchip_animal)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (nome, esp, sexo, idade, peso, pelagem, chip))

        con.commit()

    cur.close()
    con.close()

def inserir(dados):
    con = conectar()
    cur = con.cursor()

    nome = dados.get("nome_provisorio") or dados.get("nome_provisorio_animal") or dados.get("nome") or "Sem nome"
    especie = dados.get("especie") or dados.get("especie_animal") or "canino"
    sexo = dados.get("sexo") or dados.get("sexo_animal") or "indeterminado"
    idade = dados.get("idade_estimada") or dados.get("idade_animal") or dados.get("idade") or ""
    peso = dados.get("porte_peso") or dados.get("peso_animal") or dados.get("porte") or ""
    pelagem = dados.get("pelagem") or dados.get("cor_pelagem_animal") or ""
    microchip = dados.get("microchip") or dados.get("microchip_animal") or ""

    sql = '''
        INSERT INTO animais (nome_provisorio_animal, especie_animal, sexo_animal, idade_animal, peso_animal, cor_pelagem_animal, microchip_animal)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    '''
    cur.execute(sql, (nome, especie, sexo, idade, peso, pelagem, microchip if microchip else None))
    novo_id = cur.lastrowid

    con.commit()
    cur.close()
    con.close()
    return novo_id

def apagar(id_registro):
    con = conectar()
    cur = con.cursor()

    cur.execute("SELECT cod_animal FROM animais WHERE cod_animal = ?", (id_registro,))
    item = cur.fetchone()
    if not item:
        cur.close()
        con.close()
        return False

    cur.execute("DELETE FROM animais WHERE cod_animal = ?", (id_registro,))
    con.commit()
    cur.close()
    con.close()
    return True

def consultar(ordem="DESC"):
    con = conectar()
    cur = con.cursor()
    direcao = "DESC" if str(ordem).upper() == "DESC" else "ASC"
    cur.execute(f"SELECT * FROM animais ORDER BY cod_animal {direcao}")
    resultado = [_formatar_linha(r) for r in cur.fetchall()]
    cur.close()
    con.close()
    return resultado

def consultar_por_id(id_registro):
    con = conectar()
    cur = con.cursor()
    cur.execute("SELECT * FROM animais WHERE cod_animal = ?", (id_registro,))
    linha = cur.fetchone()
    resultado = _formatar_linha(linha)
    cur.close()
    con.close()
    return resultado

def consultarFiltro(filtro_sql):
    con = conectar()
    cur = con.cursor()
    cur.execute(f"SELECT * FROM animais WHERE {filtro_sql} ORDER BY cod_animal DESC")
    resultado = [_formatar_linha(r) for r in cur.fetchall()]
    cur.close()
    con.close()
    return resultado

def consultarFiltroTermo(termo="", especie="", sexo=""):
    con = conectar()
    cur = con.cursor()

    condicoes = []
    valores = []

    if termo:
        t = f"%{termo}%"
        condicoes.append("(nome_provisorio_animal LIKE ? OR cor_pelagem_animal LIKE ? OR microchip_animal LIKE ? OR peso_animal LIKE ?)")
        valores.extend([t, t, t, t])

    if especie:
        condicoes.append("especie_animal LIKE ?")
        valores.append(f"%{especie}%")

    if sexo:
        condicoes.append("sexo_animal LIKE ?")
        valores.append(f"%{sexo}%")

    sql = "SELECT * FROM animais"
    if condicoes:
        sql += " WHERE " + " AND ".join(condicoes)
    sql += " ORDER BY cod_animal DESC"

    cur.execute(sql, valores)
    resultado = [_formatar_linha(r) for r in cur.fetchall()]
    cur.close()
    con.close()
    return resultado

def alterar(id_registro, dados):
    con = conectar()
    cur = con.cursor()

    cur.execute("SELECT * FROM animais WHERE cod_animal = ?", (id_registro,))
    existente = cur.fetchone()
    if not existente:
        cur.close()
        con.close()
        return False

    mapeamento = {
        "nome_provisorio": "nome_provisorio_animal",
        "nome_provisorio_animal": "nome_provisorio_animal",
        "nome": "nome_provisorio_animal",
        "especie": "especie_animal",
        "especie_animal": "especie_animal",
        "sexo": "sexo_animal",
        "sexo_animal": "sexo_animal",
        "idade_estimada": "idade_animal",
        "idade_animal": "idade_animal",
        "idade": "idade_animal",
        "porte_peso": "peso_animal",
        "peso_animal": "peso_animal",
        "peso": "peso_animal",
        "pelagem": "cor_pelagem_animal",
        "cor_pelagem_animal": "cor_pelagem_animal",
        "microchip": "microchip_animal",
        "microchip_animal": "microchip_animal"
    }

    set_clauses = []
    valores = []
    campos_atualizados = set()

    for chave_dado, coluna in mapeamento.items():
        if chave_dado in dados and dados[chave_dado] is not None and coluna not in campos_atualizados:
            set_clauses.append(f"{coluna} = ?")
            valores.append(dados[chave_dado])
            campos_atualizados.add(coluna)

    if not set_clauses:
        cur.close()
        con.close()
        return False

    valores.append(id_registro)
    sql_update = f"UPDATE animais SET {', '.join(set_clauses)} WHERE cod_animal = ?"
    cur.execute(sql_update, valores)

    con.commit()
    cur.close()
    con.close()
    return True
