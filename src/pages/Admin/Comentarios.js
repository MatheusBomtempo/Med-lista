import React, { useState, useEffect } from "react";
import { getDocs, collection, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { database } from "../../firebase";
import { 
  Table, 
  Button, 
  Typography, 
  message, 
  DatePicker, 
  Select, 
  Space,
  Tag,
  Popconfirm,
  Tooltip
} from "antd";
import { DeleteOutlined, EyeOutlined, EyeInvisibleOutlined, WarningOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

const { Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Comentarios = () => {
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc"); // 'desc' = última para primeira, 'asc' = primeira para última
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'visible', 'denounced'

  useEffect(() => {
    carregarComentarios();
  }, []);

  useEffect(() => {
    aplicarFiltros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comments, dateRange, sortOrder, statusFilter]);

  const carregarComentarios = async () => {
    setLoading(true);
    try {
      const medicosSnapshot = await getDocs(collection(database, "medicos2"));
      const commentsData = [];

      for (let medicoDoc of medicosSnapshot.docs) {
        const medicData = medicoDoc.data();
        const medicName = medicData.nome || medicData.nomeCompleto || "Sem nome";

        const commentsSnapshot = await getDocs(collection(medicoDoc.ref, "comments"));

        commentsSnapshot.forEach((commentDoc) => {
          const commentData = commentDoc.data();
          commentsData.push({
            ...commentData,
            id: commentDoc.id,
            medicId: medicoDoc.id,
            medicName: medicName,
          });
        });
      }

      setComments(commentsData);
    } catch (error) {
      message.error("Erro ao carregar comentários: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtered = [...comments];

    // Filtro de status (visível/denunciado)
    if (statusFilter === "visible") {
      filtered = filtered.filter((comment) => comment.mostrarComentario === true);
    } else if (statusFilter === "denounced") {
      filtered = filtered.filter((comment) => comment.mostrarComentario === false);
    }

    // Filtro de data
    if (dateRange && dateRange.length === 2) {
      const startDate = dateRange[0].startOf("day");
      const endDate = dateRange[1].endOf("day");

      filtered = filtered.filter((comment) => {
        if (!comment.timestamp) return false;
        
        let commentDate;
        if (comment.timestamp.seconds) {
          commentDate = dayjs(comment.timestamp.seconds * 1000);
        } else if (comment.timestamp.toDate) {
          commentDate = dayjs(comment.timestamp.toDate());
        } else {
          return false;
        }

        return commentDate.isAfter(startDate.subtract(1, "day")) && 
               commentDate.isBefore(endDate.add(1, "day"));
      });
    }

    // Ordenação por data
    filtered.sort((a, b) => {
      let dateA, dateB;

      if (a.timestamp?.seconds) {
        dateA = a.timestamp.seconds;
      } else if (a.timestamp?.toDate) {
        dateA = a.timestamp.toDate().getTime() / 1000;
      } else {
        dateA = 0;
      }

      if (b.timestamp?.seconds) {
        dateB = b.timestamp.seconds;
      } else if (b.timestamp?.toDate) {
        dateB = b.timestamp.toDate().getTime() / 1000;
      } else {
        dateB = 0;
      }

      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    setFilteredComments(filtered);
  };

  const excluirComentario = async (commentId, medicId) => {
    try {
      const commentRef = doc(
        database,
        "medicos2",
        medicId,
        "comments",
        commentId
      );
      await deleteDoc(commentRef);
      message.success("Comentário excluído com sucesso!");
      carregarComentarios(); // Recarrega a lista
    } catch (error) {
      message.error("Erro ao excluir comentário: " + error.message);
    }
  };

  const reverterDenuncia = async (commentId, medicId) => {
    try {
      const commentRef = doc(
        database,
        "medicos2",
        medicId,
        "comments",
        commentId
      );
      await updateDoc(commentRef, {
        mostrarComentario: true,
      });
      message.success("Comentário liberado com sucesso!");
      carregarComentarios(); // Recarrega a lista
    } catch (error) {
      message.error("Erro ao liberar comentário: " + error.message);
    }
  };

  const denunciarComentario = async (commentId, medicId) => {
    try {
      const commentRef = doc(
        database,
        "medicos2",
        medicId,
        "comments",
        commentId
      );
      await updateDoc(commentRef, {
        mostrarComentario: false,
      });
      message.success("Comentário denunciado com sucesso!");
      carregarComentarios(); // Recarrega a lista
    } catch (error) {
      message.error("Erro ao denunciar comentário: " + error.message);
    }
  };

  const formatarData = (timestamp) => {
    if (!timestamp) return "Data não disponível";
    
    try {
      let date;
      if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
      } else if (timestamp.toDate) {
        date = timestamp.toDate();
      } else {
        return "Data inválida";
      }
      return date.toLocaleString("pt-BR");
    } catch (error) {
      return "Data inválida";
    }
  };

  const columns = [
    {
      title: "Paciente",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Comentário",
      dataIndex: "opinion",
      key: "opinion",
      width: 300,
      ellipsis: true,
      render: (text) => {
        const comentarioCompleto = text || "Sem comentário";
        return (
          <Tooltip title={comentarioCompleto} placement="topLeft">
            <div 
              style={{ 
                maxWidth: "300px",
                cursor: "help",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {comentarioCompleto}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "Motivo da Consulta",
      dataIndex: "consultationReason",
      key: "consultationReason",
      width: 150,
      render: (text) => text || "N/A",
    },
    {
      title: "Ações",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Popconfirm
          title="Excluir comentário"
          description="Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita."
          onConfirm={() => excluirComentario(record.id, record.medicId)}
          okText="Sim, excluir"
          cancelText="Cancelar"
          okButtonProps={{ danger: true }}
        >
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
          >
            Excluir
          </Button>
        </Popconfirm>
      ),
    },
    {
      title: "Médico",
      dataIndex: "medicName",
      key: "medicName",
      width: 200,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Avaliação",
      dataIndex: "rating",
      key: "rating",
      width: 100,
      render: (rating) => {
        if (!rating && rating !== 0) return "N/A";
        return (
          <Tag color={rating >= 4 ? "green" : rating >= 3 ? "orange" : "red"}>
            {rating}/5 ⭐
          </Tag>
        );
      },
    },
    {
      title: "Data",
      key: "timestamp",
      width: 180,
      render: (_, record) => formatarData(record.timestamp),
    },
    {
      title: "Status",
      key: "status",
      width: 150,
      render: (_, record) => (
        <Tag 
          color={record.mostrarComentario ? "green" : "orange"}
          style={{ cursor: "pointer" }}
          onClick={record.mostrarComentario 
            ? () => denunciarComentario(record.id, record.medicId)
            : () => reverterDenuncia(record.id, record.medicId)
          }
        >
          {record.mostrarComentario ? (
            <>
              <EyeOutlined /> Visível
            </>
          ) : (
            <>
              <EyeInvisibleOutlined /> Denunciado
            </>
          )}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2>Revisão de Comentários</h2>
        <p style={{ color: "#666", marginTop: "8px" }}>
          Gerencie todos os comentários da plataforma. Exclua comentários que não respeitam as diretrizes da comunidade.
        </p>
      </div>

      <div style={{ marginBottom: "24px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <Text strong style={{ display: "block", marginBottom: "8px" }}>
            Filtrar por Data:
          </Text>
          <RangePicker
            format="DD/MM/YYYY"
            placeholder={["Data inicial", "Data final"]}
            onChange={(dates) => setDateRange(dates)}
            allowClear
            style={{ width: "300px" }}
          />
        </div>

        <div>
          <Text strong style={{ display: "block", marginBottom: "8px" }}>
            Ordenar por Data:
          </Text>
          <Select
            value={sortOrder}
            onChange={setSortOrder}
            style={{ width: "200px" }}
          >
            <Option value="desc">Última para Primeira</Option>
            <Option value="asc">Primeira para Última</Option>
          </Select>
        </div>

        <div>
          <Text strong style={{ display: "block", marginBottom: "8px" }}>
            Filtrar por Status:
          </Text>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: "200px" }}
          >
            <Option value="all">Todos</Option>
            <Option value="visible">Visíveis</Option>
            <Option value="denounced">
              <Space>
                <WarningOutlined style={{ color: "#ff4d4f" }} />
                Denunciados
              </Space>
            </Option>
          </Select>
        </div>

        <div style={{ alignSelf: "flex-end" }}>
          <Button onClick={carregarComentarios} loading={loading}>
            Atualizar Lista
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <Text>
          Total de comentários: <strong>{filteredComments.length}</strong>
          {dateRange && (
            <span style={{ color: "#666", marginLeft: "16px" }}>
              (Filtrados por data)
            </span>
          )}
          {statusFilter === "denounced" && (
            <span style={{ color: "#ff4d4f", marginLeft: "16px" }}>
              <WarningOutlined /> Mostrando apenas comentários denunciados
            </span>
          )}
          {statusFilter === "visible" && (
            <span style={{ color: "#666", marginLeft: "16px" }}>
              Mostrando apenas comentários visíveis
            </span>
          )}
        </Text>
      </div>

      <Table
        columns={columns}
        dataSource={filteredComments}
        rowKey={(record) => `${record.medicId}-${record.id}`}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total de ${total} comentários`,
        }}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default Comentarios;
