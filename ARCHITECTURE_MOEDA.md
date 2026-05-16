# Moeda do Bairro — Arquitetura do Sistema

## Sistema de Moedas (Cashback Gamificado)

### Regras Fundamentais
- **Paridade**: 100 moedas = R$ 1,00
- **Acúmulo**: Cliente ganha moedas ao comprar em comércios participantes
- **Taxa padrão**: 10 moedas por R$ 1 gasto (10% cashback em moedas)
- **Resgate**: Cliente usa moedas como desconto em qualquer comércio participante
- **Validade**: Moedas expiram em 90 dias sem uso (incentiva circulação)

### Mecânicas de Gamificação
1. **Níveis de Vizinho**: Novo → Frequente → Fiel → Embaixador
   - Novo: 0-499 moedas acumuladas no total
   - Frequente: 500-1999 moedas (ganha 12 moedas/R$1)
   - Fiel: 2000-4999 moedas (ganha 15 moedas/R$1)
   - Embaixador: 5000+ moedas (ganha 20 moedas/R$1, aparece no ranking)

2. **Desafios Semanais**:
   - "Compre em 3 comércios diferentes esta semana" → +50 moedas bônus
   - "Primeira compra da semana antes das 10h" → +20 moedas
   - "Indique um vizinho" → +100 moedas quando ele fizer primeira compra

3. **Badges**:
   - Padeiro (5 compras em padarias)
   - Vizinho Solidário (indicou 3 pessoas)
   - Madrugador (5 compras antes das 9h)
   - Explorador (comprou em 5 categorias diferentes)

### Segurança e Antifraude
- Limite diário de acúmulo: 500 moedas/dia por cliente
- Limite de resgate: máximo 50% do valor da compra em moedas
- Validação: comerciante confirma transação com código de 4 dígitos
- Cooldown: mínimo 30 minutos entre transações no mesmo comércio
- Auditoria: transações acima de 200 moedas geram alerta

### Fluxo de Transação
1. Cliente compra no comércio → comerciante informa valor
2. Sistema calcula moedas (valor × taxa do nível)
3. Comerciante gera código de 4 dígitos → cliente confirma
4. Moedas creditadas na carteira do cliente
5. Para resgate: cliente informa moedas → comerciante confirma

## Filtros de Geolocalização

### Estratégia de Localização
1. **GPS do navegador** (primário): solicita permissão com mensagem clara
2. **Busca por bairro** (fallback): campo de texto com autocomplete
3. **CEP** (fallback 2): converte CEP em coordenadas aproximadas
4. **Raio ajustável**: slider de 1km a 10km (padrão: 3km)

### UX para Bairros Pequenos
- Se menos de 5 comércios no raio selecionado: expandir automaticamente
- Mostrar mensagem: "Expandimos para X km para mostrar mais opções"
- Opção "Ver todos os comércios" sem filtro de distância
- Bairros vizinhos sugeridos quando o bairro atual tem poucos resultados

### Ordenação
- Padrão: por distância (mais perto primeiro)
- Opções: por relevância, por cashback oferecido, por avaliação
