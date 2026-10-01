/**
 * Script utilitário para adicionar papel de admin a um usuário
 * 
 * COMO USAR:
 * 1. Importe este arquivo no componente onde você quer adicionar admin
 * 2. Chame a função adicionarAdmin(userId) passando o UID do usuário
 * 
 * EXEMPLO:
 * import { adicionarAdmin } from '../utils/adicionarAdmin';
 * 
 * // Em algum botão ou função:
 * await adicionarAdmin('UID_DO_USUARIO_AQUI');
 */

import { doc, setDoc, getDoc } from 'firebase/firestore';
import { database } from '../firebase';

/**
 * Adiciona o papel de admin a um usuário
 * @param {string} userId - O UID do usuário que será promovido a admin
 * @returns {Promise<boolean>} - Retorna true se foi bem-sucedido, false caso contrário
 */
export const adicionarAdmin = async (userId) => {
  try {
    if (!userId) {
      console.error('UID do usuário é obrigatório');
      return false;
    }

    const userRef = doc(database, 'users', userId);
    
    // Verifica se o documento já existe
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      // Se existe, atualiza apenas o campo role
      await setDoc(userRef, { role: 'admin' }, { merge: true });
      console.log(`✅ Usuário ${userId} promovido a admin com sucesso!`);
    } else {
      // Se não existe, cria o documento com role admin
      await setDoc(userRef, { role: 'admin' }, { merge: true });
      console.log(`✅ Documento criado e usuário ${userId} promovido a admin!`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao adicionar admin:', error);
    return false;
  }
};

/**
 * Remove o papel de admin de um usuário
 * @param {string} userId - O UID do usuário que terá o papel de admin removido
 * @returns {Promise<boolean>} - Retorna true se foi bem-sucedido, false caso contrário
 */
export const removerAdmin = async (userId) => {
  try {
    if (!userId) {
      console.error('UID do usuário é obrigatório');
      return false;
    }

    const userRef = doc(database, 'users', userId);
    await setDoc(userRef, { role: 'user' }, { merge: true });
    console.log(`✅ Papel de admin removido do usuário ${userId}`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao remover admin:', error);
    return false;
  }
};

/**
 * Verifica se um usuário é admin
 * @param {string} userId - O UID do usuário a verificar
 * @returns {Promise<boolean>} - Retorna true se o usuário é admin, false caso contrário
 */
export const verificarAdmin = async (userId) => {
  try {
    if (!userId) {
      return false;
    }

    const userRef = doc(database, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData.role === 'admin';
    }
    
    return false;
  } catch (error) {
    console.error('❌ Erro ao verificar admin:', error);
    return false;
  }
};

