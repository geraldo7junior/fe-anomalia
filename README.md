# Solar Power Anomaly Frontend

Este é o **frontend da aplicação Solar Power Anomaly**, construído com **React + Vite** e usando **Chart.js** para visualização de dados.

Ele se conecta à [API FastAPI](../backend/README.md) para simular e detectar anomalias na geração de energia solar com base em:

- Potência instalada
- Injeção mensal (kWh)
- Localização geográfica (latitude e longitude)
- Mês de análise

## Funcionalidades

- Formulário para entrada de dados
- Visualização do resultado da detecção de anomalias
- Gráfico com 13 meses (histórico + mês atual)
- Linhas de referência para:
  - Média dos 3 últimos meses
  - Fator ANEEL (115,2)
  - Mínimo Solar Estimado

---

## Como Executar

### 1. Instale as dependências
```bash
npm install
```

### 2. Execute o frontend em modo de desenvolvimento
```bash
npm run dev
```

### 3. Acesse no navegador
```
http://localhost:5173
```

> Certifique-se de que a [API FastAPI](../backend/README.md) está rodando localmente em `http://127.0.0.1:8000`.

---

## Requisitos

- Node.js 16+
- NPM ou Yarn

---

## Tecnologias Utilizadas

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Chart.js](https://www.chartjs.org/)
- [Tailwind CSS (opcional, mas utilizado no layout)](https://tailwindcss.com/)

---

## Integração com a API

A requisição POST é feita para:

```
http://127.0.0.1:8000/detect_anomaly/
```

Com o seguinte corpo:

```json
{
  "injecao": 3000,
  "potencia_instalada": 6,
  "latitude": -23.55,
  "longitude": -46.63,
  "mes": "JUL"
}
```

---

## Exemplo de Gráfico

- **Barras**: produção simulada dos últimos 12 meses + injeção atual
- **Linhas horizontais**:
  - Média dos últimos 3 meses
  - Fator ANEEL (115.2 × potência)
  - Estimativa solar mínima

---

## Estrutura do Projeto

```
solar-power-anomaly-frontend/
├── src/
│   └── App.jsx            # Lógica principal do app
├── index.html
├── vite.config.js
├── package.json
└── README.md   
```

---

## Instalar Dependências Manuais

Se necessário, instale:

```bash
npm install react-chartjs-2 chart.js
```

E, se estiver usando Tailwind (recomendado):

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

