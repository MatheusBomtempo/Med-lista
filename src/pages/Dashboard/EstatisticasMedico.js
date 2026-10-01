import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Spin } from 'antd';
import { EyeOutlined, InstagramOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { database } from '../../firebase';
import { UserAuth } from '../../contexts/contextsAuth/AuthContext';
import './EstatisticasMedico.css';

const { Title } = Typography;

const EstatisticasMedico = () => {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [historicoVisualizacoes, setHistoricoVisualizacoes] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    totalAcessos: 0,
    cliquesInstagram: 0,
    cliquesLattes: 0,
    totalAvaliacoes: 0,
  });

  const carregarEstatisticas = async () => {
    try {
      setLoading(true);
      const medicoRef = doc(database, 'medicos2', user.uid);
      const medicoDoc = await getDoc(medicoRef);

      if (medicoDoc.exists()) {
        const data = medicoDoc.data();

        // Carregar total de avaliações
        const commentsRef = collection(medicoRef, 'comments');
        const commentsSnapshot = await getDocs(commentsRef);
        const totalAvaliacoes = commentsSnapshot.size;

        // Carregar estatísticas básicas
        setEstatisticas({
          totalAcessos: data.acessos || 0,
          cliquesInstagram: data.cliquesInstagram || 0,
          cliquesLattes: data.cliquesLattes || 0,
          totalAvaliacoes: totalAvaliacoes,
        });

        // Carregar histórico de visualizações
        const historicoRef = collection(medicoRef, 'historicoVisualizacoes');
        const historicoQuery = query(historicoRef, orderBy('data', 'desc'), limit(30));
        const historicoSnapshot = await getDocs(historicoQuery);

        const historico = [];
        historicoSnapshot.forEach((doc) => {
          historico.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        // Agrupar por data para o gráfico
        const historicoAgrupado = agruparPorData(historico);
        setHistoricoVisualizacoes(historicoAgrupado);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.uid) {
      carregarEstatisticas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const agruparPorData = (historico) => {
    const agrupado = {};
    
    historico.forEach((item) => {
      const data = item.data?.toDate ? item.data.toDate() : new Date(item.data);
      const dataFormatada = data.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
      
      if (!agrupado[dataFormatada]) {
        agrupado[dataFormatada] = 0;
      }
      agrupado[dataFormatada]++;
    });

    // Converter para array e ordenar
    return Object.entries(agrupado)
      .map(([data, quantidade]) => ({ data, quantidade }))
      .sort((a, b) => {
      const [diaA, mesA] = a.data.split('/');
      const [diaB, mesB] = b.data.split('/');
      return new Date(2024, mesA - 1, diaA) - new Date(2024, mesB - 1, diaB);
    })
      .slice(-14); // Últimos 14 dias
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="estatisticas-container">
      <Title level={2} style={{ color: '#014A49', marginBottom: '24px' }}>
        Estatísticas do Perfil
      </Title>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="estatistica-card">
            <Statistic
              title="Total de Acessos"
              value={estatisticas.totalAcessos}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#014A49' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="estatistica-card">
            <Statistic
              title="Cliques no Instagram"
              value={estatisticas.cliquesInstagram}
              prefix={<InstagramOutlined />}
              valueStyle={{ color: '#014A49' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="estatistica-card">
            <Statistic
              title="Cliques no Lattes"
              value={estatisticas.cliquesLattes}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#014A49' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="estatistica-card">
            <Statistic
              title="Total de Avaliações"
              value={estatisticas.totalAvaliacoes}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#014A49' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title="Histórico de Visualizações (Últimos 14 dias)" 
            className="grafico-card"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicoVisualizacoes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="quantidade"
                  stroke="#014A49"
                  strokeWidth={2}
                  name="Visualizações"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="Cliques em Links Externos" 
            className="grafico-card"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Instagram', cliques: estatisticas.cliquesInstagram },
                { name: 'Lattes', cliques: estatisticas.cliquesLattes },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cliques" fill="#014A49" name="Cliques" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EstatisticasMedico;

