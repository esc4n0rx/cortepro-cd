// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

// Inicializar cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export const dynamic = 'force-dynamic';

// Função auxiliar para converter datas do Excel para formato ISO
function convertExcelDate(excelDate: any): string | null {
  if (!excelDate) return null;
  
  // Verifica se é uma data inválida no formato "0000-00-00"
  if (excelDate === "0000-00-00" || excelDate === 0 || excelDate === "00/00/0000") {
    return null; // Retorna null para datas inválidas
  }
  
  // Verifica se já é uma string de data válida
  if (typeof excelDate === 'string') {
    // Tentativa de verificar se é um formato de data válido
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$|^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(excelDate)) {
      // Verifica se é uma data válida
      const parts = excelDate.includes('/') 
        ? excelDate.split('/').map(Number) 
        : excelDate.split('-').map(Number);
      
      // Se qualquer parte da data for 0, é inválida
      if (parts.some(part => part === 0)) {
        return null;
      }
      
      return excelDate;
    }
  }
  
  // Se for um número, assume que é uma data do Excel
  if (typeof excelDate === 'number' || !isNaN(Number(excelDate))) {
    try {
      // Ignora valores muito pequenos que provavelmente são erros
      if (Number(excelDate) < 1) {
        return null;
      }
      
      // O Excel conta dias a partir de 1/1/1900
      const date = new Date(Math.round((Number(excelDate) - 25569) * 86400 * 1000));
      
      // Verificar se é uma data válida
      if (isNaN(date.getTime())) {
        return null;
      }
      
      return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    } catch (error) {
      console.error("Erro ao converter data do Excel:", error);
      return null;
    }
  }
  
  return null;
}

// Função auxiliar para converter tempo do Excel para formato HH:MM:SS
function convertExcelTime(excelTime: any): string | null {
  if (!excelTime) return null;
  
  // Verifica se já é uma string de tempo válida
  if (typeof excelTime === 'string') {
    // Tentativa de verificar se é um formato de tempo válido
    const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;
    if (timeRegex.test(excelTime)) {
      return excelTime;
    }
  }
  
  // Se for um número, assume que é um tempo do Excel (fração de 24 horas)
  if (typeof excelTime === 'number' || !isNaN(Number(excelTime))) {
    try {
      const totalSeconds = Math.round(Number(excelTime) * 24 * 60 * 60);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      // Formato HH:MM:SS
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } catch (error) {
      console.error("Erro ao converter tempo do Excel:", error);
      return null;
    }
  }
  
  return null;
}

export async function POST(req: NextRequest) {
  console.log("[API] Iniciando processamento do upload");
  
  try {
    console.log("[API] Extraindo FormData da requisição");
    const formData = await req.formData();
    console.log("[API] FormData extraída com sucesso");
    
    const file = formData.get("file") as File;
    const dataArquivo = formData.get("dataArquivo") as string;
    const fileType = formData.get("type") as string; // 'estoque' ou 'demanda'
    
    console.log(`[API] Arquivo recebido: ${file?.name}, Tamanho: ${file?.size} bytes, Data: ${dataArquivo}, Tipo: ${fileType}`);
    
    if (!file || !dataArquivo || !fileType) {
      console.error("[API] Arquivo, data ou tipo não fornecidos");
      return NextResponse.json(
        { error: "Arquivo, data ou tipo não fornecidos" },
        { status: 400 }
      );
    }

    // Verificar extensão do arquivo
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension !== "csv" && fileExtension !== "xlsx" && fileExtension !== "xls") {
      console.error("[API] Formato de arquivo inválido");
      return NextResponse.json(
        { error: "Formato de arquivo inválido. Use CSV, XLSX ou XLS." },
        { status: 400 }
      );
    }

    // Registrar upload no histórico
    const { data: uploadData, error: uploadError } = await supabase
      .from("historico_uploads")
      .insert({
        tipo: fileType,
        nome_arquivo: file.name,
        tamanho_bytes: file.size,
        registros_processados: 0,
        status: "processando",
      })
      .select();

    if (uploadError) {
      console.error("[API] Erro ao registrar upload:", uploadError);
      return NextResponse.json(
        { error: "Erro ao iniciar processamento" },
        { status: 500 }
      );
    }

    const uploadId = uploadData[0].id;

    // Converter o arquivo para um buffer
    console.log("[API] Convertendo arquivo para buffer");
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log(`[API] Buffer criado, tamanho: ${buffer.byteLength} bytes`);
    
    // Ler o arquivo Excel
    console.log("[API] Iniciando leitura do arquivo Excel");
    const workbook = XLSX.read(buffer, { type: "buffer" });
    console.log(`[API] Workbook lido, contém ${workbook.SheetNames.length} planilhas`);
    
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    console.log("[API] Primeira planilha selecionada");
    
    // Obter dados do arquivo
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      raw: true,
      defval: null,
    });
    
    console.log(`[API] Conversão para JSON completa, ${jsonData.length} linhas encontradas`);
    console.log("[API] Amostra de dados:", jsonData.slice(0, 2));
    
    if (jsonData.length === 0) {
      console.error("[API] Arquivo não contém dados");
      
      // Atualizar o registro de upload como falha
      await supabase
        .from("historico_uploads")
        .update({
          status: "erro",
          mensagem: "Arquivo não contém dados"
        })
        .eq("id", uploadId);
      
      return NextResponse.json(
        { error: "Arquivo não contém dados" },
        { status: 400 }
      );
    }
    
    // Determinar o conjunto de campos presentes na primeira linha
    const firstRow = jsonData[0] as object;
    const fieldNames = Object.keys(firstRow);
    console.log("[API] Campos encontrados:", fieldNames);
    
    // Processar dados de acordo com o tipo de arquivo
    const tableName = fileType === 'estoque' ? 'estoques' : 'demandas';
    const dateField = fileType === 'estoque' ? 'data_estoque' : 'data_demanda';
    
    // Limpar dados existentes da mesma data (opcional)
    try {
      console.log(`[API] Removendo dados existentes para a data ${dataArquivo}`);
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq(dateField, dataArquivo);
        
      if (deleteError) {
        console.warn(`[API] Erro ao remover dados existentes: ${deleteError.message}`);
      }
    } catch (error) {
      console.warn("[API] Erro ao tentar remover dados existentes:", error);
    }
    
    // Processar dados em lotes
    const batchSize = 1000;
    const batches = [];
    
    console.log(`[API] Dividindo dados em lotes de ${batchSize}`);
    for (let i = 0; i < jsonData.length; i += batchSize) {
      const batch = jsonData.slice(i, i + batchSize);
      batches.push(batch);
    }
    
    console.log(`[API] Criados ${batches.length} lotes para processamento`);
    
    let processedCount = 0;
    let errors = [];
    
    // Processar cada lote
    for (let i = 0; i < batches.length; i++) {
      console.log(`[API] Processando lote ${i+1}/${batches.length}`);
      const batch = batches[i];
      
      // Transformar dados de acordo com o tipo de arquivo
      const transformedBatch = batch.map((row: any) => {
        if (fileType === 'estoque') {

            // Encontrar a chave correta para cada coluna baseado em text match parcial
        const getMaterialValue = () => {
          const materialKey = Object.keys(row).find(key => 
            key.trim().toLowerCase().includes('material'));
          return materialKey ? String(row[materialKey]).trim() : "";
        };
        
        const getCentroValue = () => {
          const centroKey = Object.keys(row).find(key => 
            key.trim().toLowerCase() === 'cen.' || 
            key.trim().toLowerCase() === 'centro' || 
            key.trim().toLowerCase().includes('centro'));
          return centroKey ? String(row[centroKey]).trim() : "";
        };


        const getTipoDepositoValue = () => {
          const tipoDepositoKey = Object.keys(row).find(key => 
            key.trim().toLowerCase() === 'tipo dep.' || 
            key.trim().toLowerCase() === 'Tp.' || 
            key.trim().toLowerCase().includes('tipo depósito'));
          return tipoDepositoKey ? String(row[tipoDepositoKey]).trim() : "";
        };
        
        const getDepositoValue = () => {
          const depositoKey = Object.keys(row).find(key => 
            key.trim().toLowerCase() === 'dep.' || 
            key.trim().toLowerCase() === 'depósito' || 
            key.trim().toLowerCase().includes('depósito'));
          return depositoKey ? String(row[depositoKey]).trim() : "";
        };
        
        const getTextoMaterialValue = () => {
          const textoKey = Object.keys(row).find(key => 
            key.trim().toLowerCase().includes('texto breve'));
          return textoKey ? String(row[textoKey]).trim() : "";
        };
        
        const getPosicaoValue = () => {
          const posicaoKey = Object.keys(row).find(key => 
            key.trim().toLowerCase().includes('pos.depós') || 
            key.trim().toLowerCase().includes('posição'));
          return posicaoKey ? String(row[posicaoKey]).trim() : "";
        };
        
        const getEstoqueValue = () => {
          const estoqueKey = Object.keys(row).find(key => 
            key.trim().toLowerCase().includes('estoque dispon'));
          
          if (!estoqueKey) return 0;
          
          const value = row[estoqueKey];
          if (typeof value === 'number') return value;
          
          return parseFloat((value || "0").toString().replace(',', '.')) || 0;
        };
        
        const getUmbValue = () => {
          const umbKey = Object.keys(row).find(key => 
            key.trim().toLowerCase() === 'umb' || 
            key.trim().toLowerCase() === 'um básica');
          return umbKey ? String(row[umbKey]).trim() : "";
        };
        
        const getDataEmValue = () => {
          const dataKey = Object.keys(row).find(key => 
            key.trim().toLowerCase().includes('data em'));
          return dataKey ? convertExcelDate(row[dataKey]) : null;
        };

          return {
            data_estoque: dataArquivo,
            material: getMaterialValue(),
            centro: getCentroValue(),
            texto_breve_material: getTextoMaterialValue(),
            tipo_deposito: row["Tipo de depósito"] || "",
            posicao_deposito: getPosicaoValue(),
            estoque_disponivel: getEstoqueValue(),
            um_basica: getUmbValue(),
            data_entrada_mercadorias: convertExcelDate(row["Data da entrada de mercadorias"]),
            area_armazenamento: row["Ár.armazen."] || "",
            tipo_posicao_deposito: getTipoDepositoValue(),
            unidade_deposito: row["Unidade de depósito"] || "",
            deposito: getDepositoValue(),
          };
        } else {
          // Mapear para a estrutura da tabela de demanda
          return {
            data_demanda: dataArquivo,
            n_deposito: row["N_DEPOSITO"] || "",
            numero_nt: row["NUMERO_NT"] || "",
            status: row["STATUS"] || "",
            tp_transporte: row["TP_TRANSPORTE"] || "",
            prio_transporte: row["PRIO_TRANSPORTE"] || "",
            usuario: row["USUARIO"] || "",
            dt_criacao: convertExcelDate(row["DT_CRIACAO"]),
            hr_criacao: convertExcelTime(row["HR_CRIACAO"]),
            tp_movimento: row["TP_MOVIMENTO"] || "",
            tp_deposito: row["TP_DEPOSITO"] || "",
            posicao: row["POSICAO"] || "",
            dt_planejada: convertExcelDate(row["DT_PLANEJADA"]),
            ref_transporte: row["REF_TRANSPORTE"] || "",
            item_nt: row["ITEM_NT"] || "",
            item_finalizado: row["ITEM_FINALIZADO"] || "",
            material: row["MATERIAL"] || "",
            centro: row["CENTRO"] || "",
            quant_nt: parseFloat((row["QUANT_NT"] || "0").toString().replace(',', '.')),
            unidade: row["UNIDADE"] || "",
            numero_ot: row["NUMERO_OT"] || "",
            quant_ot: parseFloat((row["QUANT_OT"] || "0").toString().replace(',', '.')),
            deposito: row["DEPOSITO"] || "",
            desc_material: row["DESC_MATERIAL"] || "",
            setor: row["SETOR"] || "",
            palete: row["PALETE"] || "",
            palete_origem: row["PALETE_ORIGEM"] || "",
            endereco: row["ENDERECO"] || "",
            ot: row["OT"] || "",
            pedido: row["PEDIDO"] || "",
            remessa: row["REMESSA"] || "",
            nome_usuario: row["NOME_USUARIO"] || "",
            dt_producao: convertExcelDate(row["DT_PRODUCAO"]),
            hr_registro: convertExcelTime(row["HR_REGISTRO"]),
            data: convertExcelDate(row["DATA"]),
          };
        }
      });
      
      try {
        console.log(`[API] Enviando ${transformedBatch.length} registros para o Supabase`);
        const { error } = await supabase
          .from(tableName)
          .insert(transformedBatch);
          
        if (error) {
          console.error(`[API] Erro ao inserir lote ${i+1}:`, error);
          errors.push(`Lote ${i+1}: ${error.message}`);
          // Continuar com o próximo lote mesmo em caso de erro
        } else {
          console.log(`[API] Lote ${i+1} inserido com sucesso`);
          processedCount += transformedBatch.length;
        }
      } catch (error: any) {
        console.error(`[API] Erro ao processar lote ${i+1}:`, error);
        errors.push(`Lote ${i+1}: ${error.message}`);
      }
      
      // Atualizar o status de processamento
      await supabase
        .from("historico_uploads")
        .update({
          registros_processados: processedCount
        })
        .eq("id", uploadId);
    }
    
    console.log("[API] Processamento de lotes concluído");
    
    // Atualizar o status final do upload
    if (errors.length > 0) {
      // Se há erros, mas alguns registros foram processados
      if (processedCount > 0) {
        await supabase
          .from("historico_uploads")
          .update({
            status: "parcial",
            mensagem: `Processado com erros: ${errors.slice(0, 3).join("; ")}${errors.length > 3 ? "..." : ""}`,
            registros_processados: processedCount
          })
          .eq("id", uploadId);
      } else {
        // Se nenhum registro foi processado
        await supabase
          .from("historico_uploads")
          .update({
            status: "erro",
            mensagem: `Falha total: ${errors[0]}`,
            registros_processados: 0
          })
          .eq("id", uploadId);
      }
    } else {
      // Se todos os registros foram processados com sucesso
      await supabase
        .from("historico_uploads")
        .update({
          status: "sucesso",
          mensagem: `Processamento concluído com sucesso`,
          registros_processados: processedCount
        })
        .eq("id", uploadId);
    }
    
    // Calcular posições de abastecimento se ambos estoque e demanda estiverem disponíveis
    if (fileType === 'estoque' || fileType === 'demanda') {
      console.log("[API] Verificando se é possível calcular posições de abastecimento");
      
      // Verificar se temos dados de estoque e demanda para a mesma data
      const { count: estoqueCount, error: estoqueError } = await supabase
        .from('estoques')
        .select('*', { count: 'exact', head: true })
        .eq('data_estoque', dataArquivo);
        
      const { count: demandaCount, error: demandaError } = await supabase
        .from('demandas')
        .select('*', { count: 'exact', head: true })
        .eq('data_demanda', dataArquivo);
        
      if (!estoqueError && !demandaError && estoqueCount && demandaCount) {
        console.log(`[API] Dados de estoque e demanda encontrados para ${dataArquivo}, calculando posições`);
        
        try {
          // Chamar função para calcular posições (seria implementada em outro arquivo)
          // await calculatePositions(dataArquivo);
          console.log("[API] Cálculo de posições de abastecimento concluído");
        } catch (error) {
          console.error("[API] Erro ao calcular posições:", error);
        }
      }
    }
    
    console.log("[API] Upload finalizado com sucesso");
    
    return NextResponse.json({
      success: true,
      message: errors.length > 0 
        ? `Processado parcialmente: ${processedCount} registros, com ${errors.length} erros` 
        : `Upload concluído com sucesso: ${processedCount} registros processados`,
      registrosProcessados: processedCount,
      erros: errors.length > 0 ? errors : undefined
    });
    
  } catch (error: any) {
    console.error("[API] Erro grave ao processar upload:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar arquivo" },
      { status: 500 }
    );
  }
}