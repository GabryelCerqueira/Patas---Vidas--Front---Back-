import sys
import modulos

def exibir_menu():
    print("\n" + "=" * 60)
    print("      PATAS & VIDAS - CADASTRO DE ANIMAIS RESGATADOS")
    print("      (1. Identificação Básica do Animal Resgatado)")
    print("=" * 60)
    print(" [1] - Inserir novo animal no banco")
    print(" [2] - Consultar todos os animais cadastrados")
    print(" [3] - Consultar com filtro SQL (ex: especie_animal LIKE '%canino%')")
    print(" [4] - Consultar animal por ID (código)")
    print(" [5] - Alterar dados de um animal")
    print(" [6] - Apagar animal por ID")
    print(" [0] - Sair")
    print("=" * 60)

def menu_inserir():
    print("\n--- [1] CADASTRAR NOVO ANIMAL NO BANCO ---")
    nome = input("Nome provisório do animal: ").strip()
    if not nome:
        print("O nome do animal é obrigatório!")
        return

    print("Espécie: 1 - Canino | 2 - Felino | 3 - Outra")
    esp_opcao = input("Opção (padrão 1): ").strip()
    especie = "felino" if esp_opcao == "2" else ("outra" if esp_opcao == "3" else "canino")

    print("Sexo biológico: 1 - Macho | 2 - Fêmea | 3 - Indeterminado")
    sexo_opcao = input("Opção (padrão 1): ").strip()
    sexo = "femea" if sexo_opcao == "2" else ("indeterminado" if sexo_opcao == "3" else "macho")

    idade = input("Idade estimada (ex: filhote, jovem, adulto, idoso) [adulto]: ").strip() or "adulto"
    porte = input("Porte / Peso estimado (ex: Pequeno 6.5kg, Médio 12kg) [Médio]: ").strip() or "Médio"
    pelagem = input("Padrão de pelagem e cor (ex: Curta, caramelo e dourado): ").strip() or "Curta"
    microchip = input("Número do microchip (opcional, deixe vazio se não houver): ").strip()

    dados = {
        "nome_provisorio": nome,
        "especie": especie,
        "sexo": sexo,
        "idade_estimada": idade,
        "porte_peso": porte,
        "pelagem": pelagem,
        "microchip": microchip
    }

    novo_id = modulos.inserir(dados)
    print(f"\nSucesso: Animal #{novo_id} ({nome}) gravado com sucesso no banco SQLite!")

def menu_consultar():
    print("\n--- [2] CONSULTAR TODOS OS ANIMAIS CADASTRADOS ---")
    registros = modulos.consultar()
    if not registros:
        print("Nenhum animal cadastrado no banco de dados.")
        return

    print(f"Total de animais cadastrados: {len(registros)}\n")
    print(f"{'ID':<6} | {'Nome Provisório':<18} | {'Espécie':<10} | {'Sexo':<12} | {'Idade':<10} | {'Porte/Peso':<16} | {'Microchip'}")
    print("-" * 95)
    for r in registros:
        chip = r['microchip'] or "Não possui"
        print(f"#{r['id']:<5} | {r['nome_provisorio']:<18} | {r['especie']:<10} | {r['sexo']:<12} | {r['idade_estimada']:<10} | {str(r['porte_peso']):<16} | {chip}")

def menu_consultar_filtro():
    print("\n--- [3] CONSULTAR COM FILTRO SQL ---")
    filtro = input("Digite a cláusula WHERE do filtro (ex: especie_animal LIKE '%felino%'): ").strip()
    if not filtro:
        print("Filtro não informado.")
        return

    try:
        registros = modulos.consultarFiltro(filtro)
        if not registros:
            print("Nenhum registro encontrado para o filtro informado.")
            return

        print(f"\nEncontrado(s) {len(registros)} animal(is):")
        for r in registros:
            print(f"#{r['id']} - {r['nome_provisorio']} ({r['especie']}, {r['sexo']}, {r['porte_peso']}) | Pelagem: {r['pelagem']}")
    except Exception as err:
        print(f"Erro ao executar filtro SQL: {err}")

def menu_consultar_id():
    print("\n--- [4] CONSULTAR ANIMAL POR ID ---")
    try:
        id_reg = int(input("Informe o código/ID do animal: ").strip())
        r = modulos.consultar_por_id(id_reg)
        if not r:
            print(f"Animal com ID #{id_reg} não encontrado.")
            return

        print("\n" + "=" * 50)
        print(f"FICHA DO ANIMAL #{r['id']} - {r['nome_provisorio'].upper()}")
        print("=" * 50)
        print(f"  Código / ID        : {r['id']}")
        print(f"  Nome Provisório    : {r['nome_provisorio']}")
        print(f"  Espécie            : {r['especie']}")
        print(f"  Sexo Biológico     : {r['sexo']}")
        print(f"  Idade Estimada     : {r['idade_estimada']}")
        print(f"  Porte / Peso       : {r['porte_peso']}")
        print(f"  Padrão de Pelagem  : {r['pelagem']}")
        print(f"  Microchip          : {r['microchip'] or 'Não implantado'}")
        print("=" * 50)
    except ValueError:
        print("ID inválido. Digite um número inteiro.")

def menu_alterar():
    print("\n--- [5] ALTERAR DADOS DO ANIMAL ---")
    try:
        id_reg = int(input("Informe o ID a ser alterado: ").strip())
        r = modulos.consultar_por_id(id_reg)
        if not r:
            print(f"Animal com ID #{id_reg} não encontrado.")
            return

        print(f"Alterando #{id_reg} ({r['nome_provisorio']}). Deixe em branco para manter o valor atual.")
        novo_nome = input(f"Nome provisório [{r['nome_provisorio']}]: ").strip()
        novo_peso = input(f"Porte / Peso [{r['porte_peso']}]: ").strip()
        nova_idade = input(f"Idade estimada [{r['idade_estimada']}]: ").strip()
        nova_pelagem = input(f"Pelagem [{r['pelagem']}]: ").strip()
        novo_chip = input(f"Microchip [{r['microchip']}]: ").strip()

        alteracoes = {}
        if novo_nome:
            alteracoes["nome_provisorio"] = novo_nome
        if novo_peso:
            alteracoes["porte_peso"] = novo_peso
        if nova_idade:
            alteracoes["idade_estimada"] = nova_idade
        if nova_pelagem:
            alteracoes["pelagem"] = nova_pelagem
        if novo_chip:
            alteracoes["microchip"] = novo_chip

        if alteracoes:
            sucesso = modulos.alterar(id_reg, alteracoes)
            if sucesso:
                print(f"Animal #{id_reg} atualizado com sucesso!")
            else:
                print("Falha ao atualizar o animal.")
        else:
            print("Nenhuma alteração informada.")
    except Exception as err:
        print(f"Erro: {err}")

def menu_apagar():
    print("\n--- [6] APAGAR ANIMAL POR ID ---")
    try:
        id_reg = int(input("Informe o ID do animal a ser apagado: ").strip())
        confirmacao = input(f"Tem certeza que deseja apagar o registro #{id_reg}? (S/N): ").strip().upper()
        if confirmacao == "S":
            sucesso = modulos.apagar(id_reg)
            if sucesso:
                print(f"Animal #{id_reg} apagado com sucesso do banco SQLite!")
            else:
                print(f"Animal #{id_reg} não encontrado.")
        else:
            print("Operação cancelada.")
    except ValueError:
        print("ID inválido.")

def main():
    modulos.criar_tabelas()
    modulos.popular_dados_iniciais()

    while True:
        exibir_menu()
        opcao = input("Escolha uma opção (0 a 6): ").strip()
        if opcao == "1":
            menu_inserir()
        elif opcao == "2":
            menu_consultar()
        elif opcao == "3":
            menu_consultar_filtro()
        elif opcao == "4":
            menu_consultar_id()
        elif opcao == "5":
            menu_alterar()
        elif opcao == "6":
            menu_apagar()
        elif opcao == "0":
            print("\nEncerrando o sistema.\n")
            break
        else:
            print("Opção inválida. Tente novamente.")

if __name__ == "__main__":
    main()
