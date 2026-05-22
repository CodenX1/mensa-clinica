import React, { useState, useMemo } from 'react';
import { ChefHat, Users, BookOpen, ClipboardList, AlertTriangle, CheckCircle2, XCircle, Activity, Minus, Plus, Info, Clock, Flame, Thermometer, Lock, ArrowRight, MessageSquare, Inbox, Stethoscope, Upload, FileText, X } from 'lucide-react';
 
const PASSWORD_CLINICO = 'clinico2025';
 
const INGREDIENTES_INICIALES = [
  { id: 1, nombre: 'Salmón', grupo: 'Proteína animal', iddsiBase: 6, iddsiMin: 4, contraindicaciones: ['alergia_pescado', 'enfermedad_renal'], interacciones: ['warfarina'], objetivos: ['memoria', 'masa_muscular', 'peso'], esProteinaPrincipal: true, modificabilidad: 'base' },
  { id: 2, nombre: 'Calabaza', grupo: 'Vegetal', iddsiBase: 5, iddsiMin: 4, contraindicaciones: [], interacciones: [], objetivos: ['antioxidante'], esProteinaPrincipal: false, modificabilidad: 'base' },
  { id: 3, nombre: 'Kale', grupo: 'Vegetal de hoja verde', iddsiBase: 6, iddsiMin: 4, contraindicaciones: [], interacciones: ['warfarina'], objetivos: ['antioxidante', 'memoria'], esProteinaPrincipal: false, modificabilidad: 'removible' },
  { id: 4, nombre: 'Sal', grupo: 'Condimento', iddsiBase: 7, iddsiMin: 7, contraindicaciones: ['hipertension'], interacciones: [], objetivos: [], esProteinaPrincipal: false, modificabilidad: 'anadible' },
  { id: 5, nombre: 'Aceite Omega', grupo: 'Grasa', iddsiBase: 0, iddsiMin: 0, contraindicaciones: [], interacciones: ['warfarina'], objetivos: ['memoria', 'peso'], esProteinaPrincipal: false, modificabilidad: 'anadible' },
  { id: 6, nombre: 'Lentejas', grupo: 'Legumbre', iddsiBase: 5, iddsiMin: 4, contraindicaciones: [], interacciones: [], objetivos: ['peso', 'masa_muscular'], esProteinaPrincipal: true, modificabilidad: 'base' },
  { id: 7, nombre: 'Caldo de Hueso', grupo: 'Líquido', iddsiBase: 1, iddsiMin: 0, contraindicaciones: [], interacciones: [], objetivos: ['peso', 'masa_muscular'], esProteinaPrincipal: false, modificabilidad: 'base' },
  { id: 8, nombre: 'Camote', grupo: 'Tubérculo', iddsiBase: 5, iddsiMin: 4, contraindicaciones: ['diabetes'], interacciones: [], objetivos: ['peso', 'antioxidante'], esProteinaPrincipal: false, modificabilidad: 'base' },
  { id: 9, nombre: 'Cacao', grupo: 'Semilla', iddsiBase: 4, iddsiMin: 3, contraindicaciones: [], interacciones: [], objetivos: ['memoria', 'antioxidante'], esProteinaPrincipal: false, modificabilidad: 'base' },
  { id: 10, nombre: 'Aguacate', grupo: 'Fruta grasa', iddsiBase: 4, iddsiMin: 3, contraindicaciones: [], interacciones: [], objetivos: ['peso', 'memoria'], esProteinaPrincipal: false, modificabilidad: 'base' },
  { id: 11, nombre: 'Chía', grupo: 'Semilla', iddsiBase: 4, iddsiMin: 3, contraindicaciones: [], interacciones: ['warfarina'], objetivos: ['memoria', 'peso'], esProteinaPrincipal: false, modificabilidad: 'base' },
  { id: 12, nombre: 'Pollo', grupo: 'Proteína animal', iddsiBase: 6, iddsiMin: 4, contraindicaciones: ['enfermedad_renal'], interacciones: [], objetivos: ['masa_muscular', 'peso'], esProteinaPrincipal: true, modificabilidad: 'base' },
  { id: 13, nombre: 'Quinoa', grupo: 'Cereal', iddsiBase: 5, iddsiMin: 4, contraindicaciones: [], interacciones: [], objetivos: ['masa_muscular'], esProteinaPrincipal: true, modificabilidad: 'base' },
];
 
const RECETAS_INICIALES = [
  {
    id: 1, nombre: 'Puré Salmón + Calabaza + Kale', momentosDia: ['almuerzo', 'cena'],
    base: [{ id: 1, cantidadG: 80 }, { id: 2, cantidadG: 120 }],
    removibles: [{ id: 3, cantidadG: 30 }],
    anadibles: [{ id: 4, cantidadG: 1 }, { id: 5, cantidadG: 5 }],
    iddsiResultante: 5, iddsiMinimo: 4, validado: true, porcionesBase: 5,
    tiempoTotal: 35, temperaturaServicio: 'caliente', baseSabor: 'salado',
    objetivosClinicos: ['memoria', 'masa_muscular', 'peso'],
    funcionNutricional: ['proteina_completa', 'antiinflamatorio', 'antioxidante'],
    accionCerebral: ['antiinflamatorio_neuronal', 'antioxidante', 'oxigenacion'],
    tecnicas: ['vapor', 'escalfado', 'blanqueado', 'licuado', 'tamizado'],
    modificacionesAceptadas: ['sin_sal', 'sin_kale', 'iddsi_4', 'sustitucion_kale_por_espinaca'],
    proceso: [
      { paso: 1, accion: 'Cocer al vapor', ingrediente: 'calabaza', tiempo: 18, temperatura: null, nota: 'Hasta que esté completamente blanda' },
      { paso: 2, accion: 'Escalfar', ingrediente: 'salmón', tiempo: 9, temperatura: 70, nota: 'No superar 75°C para preservar omega-3. Retirar piel y espinas completamente' },
      { paso: 3, accion: 'Blanquear', ingrediente: 'kale', tiempo: 3, temperatura: 100, nota: 'Transferir inmediatamente a agua fría para fijar color' },
      { paso: 4, accion: 'Licuar', ingrediente: 'todos los ingredientes con caldo de cocción', tiempo: 3, temperatura: null, nota: 'Hasta obtener mezcla homogénea' },
      { paso: 5, accion: 'Tamizar', ingrediente: 'puré completo', tiempo: 5, temperatura: null, nota: 'Para garantizar IDDSI 4 sin fibras' },
    ],
    texturaEsperada: 'Lisa, color uniforme, sin fibras visibles, cae lento de la cuchara',
    notasCriticas: ['Temperatura crítica: salmón no debe superar 75°C', 'Kale alto en vitamina K — requiere ajuste para warfarina']
  },
  {
    id: 2, nombre: 'Puré Lentejas + Caldo + Camote', momentosDia: ['almuerzo', 'cena'],
    base: [{ id: 6, cantidadG: 80 }, { id: 7, cantidadG: 200 }, { id: 8, cantidadG: 100 }],
    removibles: [],
    anadibles: [{ id: 4, cantidadG: 1 }],
    iddsiResultante: 5, iddsiMinimo: 4, validado: true, porcionesBase: 5,
    tiempoTotal: 45, temperaturaServicio: 'caliente', baseSabor: 'salado',
    objetivosClinicos: ['peso', 'masa_muscular'],
    funcionNutricional: ['proteina_incompleta', 'densidad_calorica', 'fibra_soluble'],
    accionCerebral: ['oxigenacion'],
    tecnicas: ['coccion_absorcion', 'licuado', 'tamizado'],
    modificacionesAceptadas: ['sin_sal', 'iddsi_4'],
    proceso: [
      { paso: 1, accion: 'Remojar', ingrediente: 'lentejas', tiempo: 60, temperatura: null, nota: 'Mínimo 1 hora antes' },
      { paso: 2, accion: 'Cocinar', ingrediente: 'lentejas en caldo de hueso', tiempo: 30, temperatura: 95, nota: 'Hasta que estén completamente tiernas' },
      { paso: 3, accion: 'Agregar', ingrediente: 'camote en cubos', tiempo: 15, temperatura: 95, nota: 'Cocinar hasta que se deshaga con tenedor' },
      { paso: 4, accion: 'Licuar', ingrediente: 'mezcla completa', tiempo: 3, temperatura: null, nota: 'Con caldo de cocción para textura' },
      { paso: 5, accion: 'Tamizar', ingrediente: 'puré', tiempo: 3, temperatura: null, nota: 'Para IDDSI 4 si requerido' },
    ],
    texturaEsperada: 'Cremosa, espesa, homogénea',
    notasCriticas: ['Lentejas son proteína incompleta — considerar complemento en otro tiempo de comida']
  },
  {
    id: 3, nombre: 'Mousse Cacao + Aguacate + Chía', momentosDia: ['merienda_tarde', 'colacion_nocturna', 'postre'],
    base: [{ id: 9, cantidadG: 15 }, { id: 10, cantidadG: 80 }, { id: 11, cantidadG: 10 }],
    removibles: [],
    anadibles: [],
    iddsiResultante: 4, iddsiMinimo: 3, validado: true, porcionesBase: 5,
    tiempoTotal: 130, temperaturaServicio: 'frio', baseSabor: 'dulce',
    objetivosClinicos: ['memoria', 'peso'],
    funcionNutricional: ['densidad_calorica', 'antioxidante', 'omega_3', 'fibra'],
    accionCerebral: ['antioxidante', 'antiinflamatorio_neuronal', 'proteccion_membrana'],
    tecnicas: ['hidratacion_frio', 'licuado', 'emulsionado', 'refrigeracion'],
    modificacionesAceptadas: ['iddsi_3'],
    proceso: [
      { paso: 1, accion: 'Hidratar', ingrediente: 'chía en leche vegetal', tiempo: 120, temperatura: 4, nota: 'Mínimo 2 horas, preferible noche anterior' },
      { paso: 2, accion: 'Procesar', ingrediente: 'aguacate maduro', tiempo: 2, temperatura: null, nota: 'Hasta obtener crema lisa' },
      { paso: 3, accion: 'Incorporar', ingrediente: 'cacao y chía hidratada', tiempo: 1, temperatura: null, nota: 'Mezclar uniformemente' },
      { paso: 4, accion: 'Emulsionar', ingrediente: 'mezcla completa', tiempo: 3, temperatura: null, nota: 'Velocidad alta para incorporar aire' },
      { paso: 5, accion: 'Refrigerar', ingrediente: 'mousse', tiempo: 60, temperatura: 4, nota: 'Estabiliza textura aireada' },
    ],
    texturaEsperada: 'Aireada, cremosa, se sostiene sola pero cede con cuchara',
    notasCriticas: ['No usa calor — preserva nutrientes intactos', 'Chía interactúa con anticoagulantes']
  },
  {
    id: 4, nombre: 'Puré Pollo + Quinoa', momentosDia: ['almuerzo', 'cena'],
    base: [{ id: 12, cantidadG: 80 }, { id: 13, cantidadG: 60 }],
    removibles: [],
    anadibles: [{ id: 4, cantidadG: 1 }],
    iddsiResultante: 5, iddsiMinimo: 4, validado: true, porcionesBase: 5,
    tiempoTotal: 40, temperaturaServicio: 'caliente', baseSabor: 'salado',
    objetivosClinicos: ['masa_muscular', 'peso'],
    funcionNutricional: ['proteina_completa', 'aminoacidos_completos'],
    accionCerebral: ['sintesis_neurotransmisores'],
    tecnicas: ['coccion_absorcion', 'escalfado', 'licuado', 'tamizado'],
    modificacionesAceptadas: ['sin_sal', 'iddsi_4'],
    proceso: [
      { paso: 1, accion: 'Cocinar', ingrediente: 'quinoa en agua', tiempo: 18, temperatura: 95, nota: 'Proporción 1:2 con agua' },
      { paso: 2, accion: 'Escalfar', ingrediente: 'pollo en caldo', tiempo: 15, temperatura: 85, nota: 'Hasta cocción completa interna' },
      { paso: 3, accion: 'Desmenuzar', ingrediente: 'pollo', tiempo: 2, temperatura: null, nota: 'Verificar ausencia de huesos o cartílago' },
      { paso: 4, accion: 'Licuar', ingrediente: 'pollo + quinoa + caldo', tiempo: 3, temperatura: null, nota: 'Hasta textura homogénea' },
      { paso: 5, accion: 'Tamizar', ingrediente: 'puré', tiempo: 3, temperatura: null, nota: 'Para IDDSI 4' },
    ],
    texturaEsperada: 'Suave, ligeramente granulada por la quinoa, sin fibras de pollo',
    notasCriticas: ['Pollo es proteína completa de fácil digestión']
  },
  {
    id: 5, nombre: 'Puré Salmón + Aguacate + Camote', momentosDia: ['almuerzo', 'cena'],
    base: [{ id: 1, cantidadG: 70 }, { id: 10, cantidadG: 50 }, { id: 8, cantidadG: 100 }],
    removibles: [],
    anadibles: [{ id: 4, cantidadG: 1 }],
    iddsiResultante: 4, iddsiMinimo: 4, validado: true, porcionesBase: 5,
    tiempoTotal: 35, temperaturaServicio: 'caliente', baseSabor: 'salado',
    objetivosClinicos: ['peso', 'memoria'],
    funcionNutricional: ['proteina_completa', 'densidad_calorica', 'omega_3'],
    accionCerebral: ['antiinflamatorio_neuronal', 'proteccion_membrana'],
    tecnicas: ['vapor', 'escalfado', 'licuado'],
    modificacionesAceptadas: ['sin_sal'],
    proceso: [
      { paso: 1, accion: 'Cocer al vapor', ingrediente: 'camote', tiempo: 20, temperatura: null, nota: 'Hasta completamente blando' },
      { paso: 2, accion: 'Escalfar', ingrediente: 'salmón', tiempo: 9, temperatura: 70, nota: 'No superar 75°C' },
      { paso: 3, accion: 'Procesar', ingrediente: 'aguacate maduro', tiempo: 1, temperatura: null, nota: 'Crema lisa' },
      { paso: 4, accion: 'Licuar', ingrediente: 'todo junto', tiempo: 3, temperatura: null, nota: 'Hasta IDDSI 4' },
    ],
    texturaEsperada: 'Cremosa, suave, alta densidad',
    notasCriticas: ['Combinación de alta densidad calórica ideal para subir peso']
  },
  {
    id: 6, nombre: 'Puré Avena + Banano + Nuez', momentosDia: ['desayuno'],
    base: [{ id: 15, cantidadG: 80 }, { id: 7, cantidadG: 150 }],
    removibles: [],
    anadibles: [{ id: 5, cantidadG: 3 }],
    iddsiResultante: 5, iddsiMinimo: 4, validado: true, porcionesBase: 5,
    tiempoTotal: 20, temperaturaServicio: 'caliente', baseSabor: 'dulce',
    objetivosClinicos: ['peso', 'memoria'],
    funcionNutricional: ['densidad_calorica', 'fibra_soluble', 'omega_3'],
    accionCerebral: ['sintesis_neurotransmisores'],
    tecnicas: ['coccion_absorcion', 'licuado'],
    modificacionesAceptadas: ['iddsi_4'],
    proceso: [
      { paso: 1, accion: 'Cocinar', ingrediente: 'banano con leche', tiempo: 10, temperatura: 95, nota: 'Hasta espesar' },
      { paso: 2, accion: 'Licuar', ingrediente: 'mezcla completa', tiempo: 2, temperatura: null, nota: 'Hasta homogéneo' },
    ],
    texturaEsperada: 'Cremosa, dulce natural, espesa',
    notasCriticas: ['Banano aporta triptófano para serotonina matutina']
  },
  {
    id: 7, nombre: 'Desayuno Verde Energético', momentosDia: ['desayuno', 'merienda_manana'],
    base: [{ id: 10, cantidadG: 50 }, { id: 15, cantidadG: 80 }, { id: 11, cantidadG: 10 }],
    removibles: [{ id: 14, cantidadG: 20 }],
    anadibles: [],
    iddsiResultante: 4, iddsiMinimo: 3, validado: true, porcionesBase: 5,
    tiempoTotal: 10, temperaturaServicio: 'frio', baseSabor: 'dulce',
    objetivosClinicos: ['antioxidante', 'memoria', 'peso'],
    funcionNutricional: ['densidad_calorica', 'omega_3', 'antioxidante'],
    accionCerebral: ['antioxidante', 'oxigenacion', 'antiinflamatorio_neuronal'],
    tecnicas: ['licuado', 'hidratacion_frio'],
    modificacionesAceptadas: ['sin_kale', 'iddsi_3'],
    proceso: [
      { paso: 1, accion: 'Hidratar', ingrediente: 'chía en leche vegetal', tiempo: 15, temperatura: 4, nota: 'Mínimo 15 min para activar' },
      { paso: 2, accion: 'Licuar', ingrediente: 'todos los ingredientes', tiempo: 3, temperatura: null, nota: 'Hasta homogéneo y cremoso' },
    ],
    texturaEsperada: 'Cremosa, color verde claro, fluida',
    notasCriticas: ['Espinacas alto en vitamina K — sustituir si toma warfarina']
  },
  {
    id: 8, nombre: 'Compota de Frutos Rojos + Chía', momentosDia: ['merienda_manana', 'merienda_tarde', 'colacion_nocturna'],
    base: [{ id: 15, cantidadG: 60 }, { id: 11, cantidadG: 8 }],
    removibles: [],
    anadibles: [],
    iddsiResultante: 4, iddsiMinimo: 3, validado: true, porcionesBase: 5,
    tiempoTotal: 25, temperaturaServicio: 'ambiente', baseSabor: 'dulce',
    objetivosClinicos: ['antioxidante', 'memoria'],
    funcionNutricional: ['antioxidante', 'fibra', 'omega_3'],
    accionCerebral: ['antioxidante', 'antiinflamatorio_neuronal'],
    tecnicas: ['coccion_absorcion', 'licuado', 'hidratacion_frio'],
    modificacionesAceptadas: ['iddsi_3'],
    proceso: [
      { paso: 1, accion: 'Hidratar', ingrediente: 'chía en agua', tiempo: 15, temperatura: 4, nota: 'Hasta gel' },
      { paso: 2, accion: 'Cocinar', ingrediente: 'frutas a fuego lento', tiempo: 8, temperatura: 80, nota: 'Hasta deshacerse' },
      { paso: 3, accion: 'Incorporar', ingrediente: 'chía hidratada', tiempo: 1, temperatura: null, nota: 'Mezclar uniforme' },
    ],
    texturaEsperada: 'Compota suave, ligera consistencia gelatinosa',
    notasCriticas: ['Chía interactúa con anticoagulantes']
  },
  {
    id: 9, nombre: 'Caldo Restaurador con Pollo', momentosDia: ['colacion_nocturna'],
    base: [{ id: 12, cantidadG: 40 }, { id: 7, cantidadG: 250 }, { id: 8, cantidadG: 50 }],
    removibles: [],
    anadibles: [{ id: 4, cantidadG: 1 }],
    iddsiResultante: 3, iddsiMinimo: 2, validado: true, porcionesBase: 5,
    tiempoTotal: 60, temperaturaServicio: 'tibio', baseSabor: 'salado',
    objetivosClinicos: ['masa_muscular', 'peso'],
    funcionNutricional: ['proteina_completa', 'colageno'],
    accionCerebral: ['sintesis_neurotransmisores'],
    tecnicas: ['coccion_absorcion', 'licuado', 'tamizado'],
    modificacionesAceptadas: ['sin_sal', 'iddsi_2'],
    proceso: [
      { paso: 1, accion: 'Cocinar', ingrediente: 'pollo en caldo', tiempo: 30, temperatura: 90, nota: 'Cocción lenta para concentrar' },
      { paso: 2, accion: 'Agregar', ingrediente: 'camote', tiempo: 20, temperatura: 90, nota: 'Hasta deshacer' },
      { paso: 3, accion: 'Licuar', ingrediente: 'todo junto', tiempo: 3, temperatura: null, nota: 'Muy fino' },
      { paso: 4, accion: 'Tamizar', ingrediente: 'caldo', tiempo: 2, temperatura: null, nota: 'Para IDDSI 2-3' },
    ],
    texturaEsperada: 'Líquido espeso, sin fibras, ligero al paladar',
    notasCriticas: ['Ideal para colación nocturna por digestión fácil']
  },
];
 
const PACIENTES_INICIALES = [
  { id: 1, nombre: 'María González', habitacion: '12', edad: 82, iddsi: 5, condiciones: [], medicamentos: [], alergias: [], objetivos: ['memoria'] },
  { id: 2, nombre: 'Juan Pérez', habitacion: '04', edad: 78, iddsi: 5, condiciones: ['hipertension'], medicamentos: ['warfarina'], alergias: [], objetivos: ['memoria', 'peso'] },
  { id: 3, nombre: 'Pedro Ramírez', habitacion: '08', edad: 85, iddsi: 4, condiciones: [], medicamentos: ['warfarina'], alergias: [], objetivos: ['memoria'] },
  { id: 4, nombre: 'Ana Castro', habitacion: '15', edad: 79, iddsi: 5, condiciones: ['diabetes'], medicamentos: [], alergias: [], objetivos: ['memoria'] },
  { id: 5, nombre: 'Carlos Mendoza', habitacion: '01', edad: 88, iddsi: 4, condiciones: ['enfermedad_renal'], medicamentos: [], alergias: ['alergia_pescado'], objetivos: ['masa_muscular'] },
  { id: 6, nombre: 'Lucía Morales', habitacion: '09', edad: 81, iddsi: 4, condiciones: [], medicamentos: [], alergias: [], objetivos: ['peso', 'memoria'] },
  { id: 7, nombre: 'Roberto Silva', habitacion: '07', edad: 84, iddsi: 5, condiciones: ['hipertension', 'diabetes'], medicamentos: [], alergias: [], objetivos: ['peso'] },
  { id: 8, nombre: 'Elena Vargas', habitacion: '11', edad: 76, iddsi: 5, condiciones: [], medicamentos: [], alergias: [], objetivos: ['memoria'] },
];
 
// ═══════════════════════════════════════════════════════════════
// MOTOR
// ═══════════════════════════════════════════════════════════════
 
function getIngredientesIds(receta, capa) {
  return receta[capa].map(item => typeof item === 'object' ? item.id : item);
}
 
function evaluarRecetaParaPaciente(receta, paciente, ingredientes) {
  if (receta.iddsiMinimo > paciente.iddsi) return { compatible: false, motivo: 'No alcanza IDDSI ' + paciente.iddsi };
  const baseIds = getIngredientesIds(receta, 'base');
  const removiblesIds = getIngredientesIds(receta, 'removibles');
  const anadiblesIds = getIngredientesIds(receta, 'anadibles');
  const removidos = [];
  const noAnadir = [];
 
  for (const ingId of baseIds) {
    const ing = ingredientes.find(i => i.id === ingId);
    if (!ing) continue;
    for (const alergia of paciente.alergias) {
      if (ing.contraindicaciones.includes(alergia)) return { compatible: false, motivo: 'Alergia a ' + ing.nombre };
    }
  }
  for (const ingId of baseIds) {
    const ing = ingredientes.find(i => i.id === ingId);
    if (!ing) continue;
    for (const cond of paciente.condiciones) {
      if (ing.contraindicaciones.includes(cond)) return { compatible: false, motivo: ing.nombre + ' contraindicado' };
    }
  }
  for (const ingId of removiblesIds) {
    const ing = ingredientes.find(i => i.id === ingId);
    if (!ing) continue;
    let removerEste = false;
    for (const med of paciente.medicamentos) if (ing.interacciones.includes(med)) removerEste = true;
    for (const cond of paciente.condiciones) if (ing.contraindicaciones.includes(cond)) removerEste = true;
    if (removerEste) removidos.push(ing.nombre);
  }
  for (const ingId of anadiblesIds) {
    const ing = ingredientes.find(i => i.id === ingId);
    if (!ing) continue;
    let noAgregarEste = false;
    for (const cond of paciente.condiciones) if (ing.contraindicaciones.includes(cond)) noAgregarEste = true;
    for (const med of paciente.medicamentos) if (ing.interacciones.includes(med)) noAgregarEste = true;
    if (noAgregarEste) noAnadir.push(ing.nombre);
  }
  const requiereTriturado = receta.iddsiResultante > paciente.iddsi;
  return { compatible: true, variaciones: { remover: removidos, noAnadir: noAnadir, triturarA: requiereTriturado ? paciente.iddsi : null } };
}
 
function evaluarCobertura(recetas, pacientes, ingredientes) {
  const resultados = recetas.map(receta => {
    if (!receta) return null;
    const cubiertos = [];
    const noCubiertos = [];
    pacientes.forEach(p => {
      const ev = evaluarRecetaParaPaciente(receta, p, ingredientes);
      if (ev.compatible) cubiertos.push({ paciente: p, variaciones: ev.variaciones });
      else noCubiertos.push({ paciente: p, motivo: ev.motivo });
    });
    return { receta, cubiertos, noCubiertos };
  });
 
  const pacientesCubiertosIds = new Set();
  resultados.forEach(r => { if (r) r.cubiertos.forEach(c => pacientesCubiertosIds.add(c.paciente.id)); });
  const pacientesNoCubiertos = pacientes.filter(p => !pacientesCubiertosIds.has(p.id));
 
  let estado = 'aprobado';
  if (pacientesNoCubiertos.length > 0) estado = 'no_aprobado';
  else {
    const conteoOpciones = {};
    pacientes.forEach(p => { conteoOpciones[p.id] = 0; });
    resultados.forEach(r => { if (r) r.cubiertos.forEach(c => { conteoOpciones[c.paciente.id]++; }); });
    if (Object.values(conteoOpciones).some(v => v === 1)) estado = 'observacion';
  }
  return { resultados, estado, pacientesNoCubiertos, totalPacientes: pacientes.length, cubiertos: pacientesCubiertosIds.size };
}
 
function asignarPacientesACaminos(evaluacion) {
  // Cada paciente aparece en TODOS los caminos donde es compatible
  // Esto le da visibilidad al chef sobre la flexibilidad de cada paciente
  const asignaciones = { 0: [], 1: [], 2: [] };
  
  evaluacion.resultados.forEach((r, idx) => {
    if (!r) return;
    r.cubiertos.forEach(match => {
      asignaciones[idx].push(match);
    });
  });
  
  return asignaciones;
}
 
function obtenerPacientesConUnaOpcion(evaluacion) {
  // Identifica pacientes que solo pueden comer de UN camino
  // Estos son los que generan "observación"
  const conteoOpciones = {};
  const pacienteData = {};
  
  evaluacion.resultados.forEach((r, idx) => {
    if (!r) return;
    r.cubiertos.forEach(c => {
      if (!conteoOpciones[c.paciente.id]) {
        conteoOpciones[c.paciente.id] = 0;
        pacienteData[c.paciente.id] = c.paciente;
      }
      conteoOpciones[c.paciente.id]++;
    });
  });
  
  return Object.entries(conteoOpciones)
    .filter(([_, count]) => count === 1)
    .map(([id]) => pacienteData[id]);
}
 
const CONDICIONES_LABEL = { hipertension: 'Hipertensión', diabetes: 'Diabetes', enfermedad_renal: 'Enf. renal', alergia_pescado: 'Alergia pescado' };
const OBJETIVOS_LABEL = { memoria: 'Memoria', peso: 'Subir peso', masa_muscular: 'Masa muscular', antioxidante: 'Antioxidante' };
const FUNCIONES_LABEL = { proteina_completa: 'Proteína completa', proteina_incompleta: 'Proteína incompleta', antiinflamatorio: 'Antiinflamatorio', antioxidante: 'Antioxidante', densidad_calorica: 'Densidad calórica', fibra_soluble: 'Fibra soluble', fibra: 'Fibra', omega_3: 'Omega-3', aminoacidos_completos: 'Aminoácidos completos' };
const ACCION_CEREBRAL_LABEL = { antiinflamatorio_neuronal: 'Antiinflamatorio neuronal', antioxidante: 'Antioxidante cerebral', oxigenacion: 'Oxigenación cerebral', proteccion_membrana: 'Protección de membrana neuronal', sintesis_neurotransmisores: 'Síntesis de neurotransmisores' };
const TECNICAS_LABEL = { vapor: 'Cocción al vapor', escalfado: 'Escalfado', blanqueado: 'Blanqueado', licuado: 'Licuado', tamizado: 'Tamizado', coccion_absorcion: 'Cocción por absorción', hidratacion_frio: 'Hidratación en frío', emulsionado: 'Emulsionado', refrigeracion: 'Refrigeración' };
const MODIFICACIONES_LABEL = { sin_sal: 'Sin sal', sin_kale: 'Sin kale', iddsi_4: 'Triturar a IDDSI 4', iddsi_3: 'Triturar a IDDSI 3', sustitucion_kale_por_espinaca: 'Sustituir kale por espinaca' };
const MOMENTOS_LABEL = {
  desayuno: 'Desayuno',
  merienda_manana: 'Merienda mañana',
  almuerzo: 'Almuerzo',
  merienda_tarde: 'Merienda tarde',
  cena: 'Cena',
  colacion_nocturna: 'Colación nocturna',
  postre: 'Postre'
};
 
// Configuración de cantidad de caminos por tiempo de comida
const CAMINOS_POR_MOMENTO = {
  desayuno: 3,
  merienda_manana: 2,
  almuerzo: 3,
  merienda_tarde: 2,
  cena: 3,
  colacion_nocturna: 2,
  postre: 2
};
 
// Orden de los tiempos de comida en el día
const ORDEN_MOMENTOS = ['desayuno', 'merienda_manana', 'almuerzo', 'merienda_tarde', 'cena', 'colacion_nocturna'];
 
// ═══════════════════════════════════════════════════════════════
// SISTEMA DE CICLOS
// ═══════════════════════════════════════════════════════════════
 
const DIAS_SEMANA = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const DIAS_LABEL = {
  lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves',
  viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo'
};
const DIAS_LABEL_CORTO = {
  lunes: 'Lun', martes: 'Mar', miercoles: 'Mié', jueves: 'Jue',
  viernes: 'Vie', sabado: 'Sáb', domingo: 'Dom'
};
 
const DURACION_CICLO_SEMANAS = 4;
 
function crearDiaVacio() {
  const dia = { tiempos: {} };
  ORDEN_MOMENTOS.forEach(momento => {
    const numCaminos = CAMINOS_POR_MOMENTO[momento] || 3;
    dia.tiempos[momento] = Array(numCaminos).fill(null);
  });
  return dia;
}
 
function crearSemanaVacia(numero) {
  const semana = { numero, dias: {} };
  DIAS_SEMANA.forEach(d => { semana.dias[d] = crearDiaVacio(); });
  return semana;
}
 
function crearCicloVacio(nombre = 'Ciclo Inicial 2026') {
  return {
    id: 'ciclo_' + Date.now(),
    nombre,
    estado: 'activo',
    fechaCreacion: new Date().toISOString(),
    fechaInicio: new Date().toISOString().split('T')[0], // hoy
    duracionSemanas: DURACION_CICLO_SEMANAS,
    semanas: Array.from({ length: DURACION_CICLO_SEMANAS }, (_, i) => crearSemanaVacia(i + 1)),
    notas: ''
  };
}
 
// Calcula qué día del ciclo es "hoy" basado en la fecha de inicio
function calcularHoyEnCiclo(ciclo) {
  if (!ciclo || !ciclo.fechaInicio) return { semana: 1, dia: 'lunes' };
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const inicio = new Date(ciclo.fechaInicio + 'T00:00:00');
  const diffDias = Math.floor((hoy - inicio) / (1000 * 60 * 60 * 24));
  
  if (diffDias < 0) return { semana: 1, dia: 'lunes' }; // ciclo no ha empezado
  
  const diasTotalCiclo = ciclo.duracionSemanas * 7;
  // Si el ciclo se terminó, se considera que rota (resetea)
  const diaEnCiclo = diffDias % diasTotalCiclo;
  
  const semana = Math.floor(diaEnCiclo / 7) + 1;
  const diaSemanaIdx = diaEnCiclo % 7;
  
  return { semana, dia: DIAS_SEMANA[diaSemanaIdx] };
}
 
// Obtiene los caminos asignados a un día/tiempo específico
function obtenerCaminosDelDia(ciclo, numSemana, diaSemana) {
  if (!ciclo) return null;
  const semana = ciclo.semanas.find(s => s.numero === numSemana);
  if (!semana) return null;
  return semana.dias[diaSemana] || null;
}
 
// Actualiza los caminos de un día/tiempo específico
function actualizarCaminosDelDia(ciclo, numSemana, diaSemana, momento, caminos) {
  const nuevoCiclo = {
    ...ciclo,
    semanas: ciclo.semanas.map(s => {
      if (s.numero !== numSemana) return s;
      return {
        ...s,
        dias: {
          ...s.dias,
          [diaSemana]: {
            ...s.dias[diaSemana],
            tiempos: {
              ...s.dias[diaSemana].tiempos,
              [momento]: caminos
            }
          }
        }
      };
    })
  };
  return nuevoCiclo;
}
 
// Calcula el estado de un día completo (agregando todos los tiempos)
function calcularEstadoDia(dia, pacientes, ingredientes, recetas) {
  if (!dia) return 'vacio';
  
  const tiempos = Object.values(dia.tiempos);
  const todoVacio = tiempos.every(caminos => caminos.every(c => c === null));
  if (todoVacio) return 'vacio';
  
  // Por cada tiempo de comida, evalúa la cobertura
  let hayNoAprobado = false;
  let hayObservacion = false;
  let hayVacio = false;
  
  for (const [momento, caminos] of Object.entries(dia.tiempos)) {
    const algunVacio = caminos.some(c => c === null);
    const todosVacios = caminos.every(c => c === null);
    
    if (todosVacios) {
      hayVacio = true;
      continue;
    }
    if (algunVacio) hayVacio = true;
    
    const recetasSel = caminos.map(id => id ? recetas.find(r => r.id === id) : null);
    const ev = evaluarCobertura(recetasSel, pacientes, ingredientes);
    
    if (ev.estado === 'no_aprobado') hayNoAprobado = true;
    if (ev.estado === 'observacion') hayObservacion = true;
  }
  
  if (hayNoAprobado) return 'no_aprobado';
  if (hayVacio) return 'parcial';
  if (hayObservacion) return 'observacion';
  return 'aprobado';
}
 
const IDDSI_DESC = { 0: 'Líquido fino', 1: 'Líquido levemente espeso', 2: 'Líquido espeso', 3: 'Líquido muy espeso', 4: 'Puré liso', 5: 'Picado fino húmedo', 6: 'Blando, se desmenuza', 7: 'Sólido normal' };
 
// ═══════════════════════════════════════════════════════════════
// BASE DE CONOCIMIENTO CLÍNICO MOCK
// Simula respuestas de APIs reales (NIH, Drugs.com, FARE, ODS)
// ═══════════════════════════════════════════════════════════════
 
const CONOCIMIENTO_CONDICIONES = {
  'parkinson': {
    nombre: 'Parkinson',
    categoria: 'Enfermedad neurodegenerativa',
    descripcion: 'Trastorno progresivo del sistema nervioso que afecta movimiento, función cognitiva y deglución.',
    restricciones: [
      { tipo: 'proteina_alta', severidad: 'moderada', motivo: 'Interfiere con absorción de levodopa', ventana: '1h antes/después de medicación' },
      { tipo: 'vitamina_b6_alta', severidad: 'baja', motivo: 'Puede acelerar metabolismo de levodopa', ventana: 'consistencia diaria' }
    ],
    recomendaciones: [
      { tipo: 'fibra_alta', motivo: 'Estreñimiento es síntoma común' },
      { tipo: 'antioxidantes', motivo: 'Estrés oxidativo aumenta el deterioro neuronal' },
      { tipo: 'omega_3', motivo: 'Neuroprotección documentada' }
    ],
    medicamentos_asociados: ['levodopa', 'carbidopa'],
    objetivos_asociados: ['memoria', 'antioxidante', 'peso'],
    fuente: 'NIH NINDS / Mayo Clinic / PubMed 2023'
  },
  'alzheimer': {
    nombre: 'Alzheimer',
    categoria: 'Demencia neurodegenerativa',
    descripcion: 'Forma más común de demencia caracterizada por pérdida progresiva de memoria y función cognitiva.',
    restricciones: [
      { tipo: 'azucares_simples', severidad: 'moderada', motivo: 'Inflamación cerebral acelerada' },
      { tipo: 'grasas_trans', severidad: 'alta', motivo: 'Daño documentado a mielina neuronal' }
    ],
    recomendaciones: [
      { tipo: 'omega_3', motivo: 'Protección de membrana neuronal' },
      { tipo: 'antioxidantes', motivo: 'Reduce placas beta-amiloide' },
      { tipo: 'vitamina_e', motivo: 'Retrasa deterioro cognitivo' },
      { tipo: 'dieta_mind', motivo: 'Validado clínicamente para demencia' }
    ],
    medicamentos_asociados: ['donepezilo', 'memantina'],
    objetivos_asociados: ['memoria', 'antioxidante'],
    fuente: 'NIH NIA / Alzheimer\'s Association / Dieta MIND'
  },
  'epoc': {
    nombre: 'EPOC',
    categoria: 'Enfermedad pulmonar crónica',
    descripcion: 'Enfermedad pulmonar obstructiva crónica que dificulta la respiración.',
    restricciones: [
      { tipo: 'sodio_alto', severidad: 'moderada', motivo: 'Retención de líquidos aumenta carga respiratoria' },
      { tipo: 'comidas_grandes', severidad: 'alta', motivo: 'Distensión abdominal dificulta respiración' }
    ],
    recomendaciones: [
      { tipo: 'densidad_calorica', motivo: 'Pacientes con bajo peso por gasto energético respiratorio' },
      { tipo: 'proteina_alta', motivo: 'Mantenimiento muscular respiratorio' },
      { tipo: 'porciones_pequenas_frecuentes', motivo: 'Reduce trabajo respiratorio por digestión' }
    ],
    medicamentos_asociados: ['salbutamol', 'prednisona'],
    objetivos_asociados: ['peso', 'masa_muscular'],
    fuente: 'NIH NHLBI / GOLD Guidelines 2024'
  },
  'insuficiencia_cardiaca': {
    nombre: 'Insuficiencia cardíaca',
    categoria: 'Enfermedad cardiovascular',
    descripcion: 'Incapacidad del corazón para bombear sangre eficientemente.',
    restricciones: [
      { tipo: 'sodio_alto', severidad: 'critica', motivo: 'Causa retención de líquidos y empeoramiento' },
      { tipo: 'liquidos_excesivos', severidad: 'alta', motivo: 'Sobrecarga de volumen' }
    ],
    recomendaciones: [
      { tipo: 'potasio_controlado', motivo: 'Balance crítico con diuréticos' },
      { tipo: 'omega_3', motivo: 'Reduce mortalidad cardiovascular' }
    ],
    medicamentos_asociados: ['furosemida', 'enalapril', 'espironolactona'],
    objetivos_asociados: ['peso'],
    fuente: 'AHA / ESC Heart Failure Guidelines'
  },
  'osteoporosis': {
    nombre: 'Osteoporosis',
    categoria: 'Enfermedad ósea',
    descripcion: 'Pérdida de densidad mineral ósea con riesgo de fracturas.',
    restricciones: [
      { tipo: 'sodio_alto', severidad: 'moderada', motivo: 'Aumenta excreción de calcio' },
      { tipo: 'cafeina_alta', severidad: 'baja', motivo: 'Interfiere con absorción de calcio' }
    ],
    recomendaciones: [
      { tipo: 'calcio_alto', motivo: 'Esencial para densidad ósea' },
      { tipo: 'vitamina_d', motivo: 'Absorción de calcio' },
      { tipo: 'proteina_adecuada', motivo: 'Matriz ósea' }
    ],
    medicamentos_asociados: ['alendronato', 'denosumab'],
    objetivos_asociados: ['masa_muscular'],
    fuente: 'NIH ODS / NOF Guidelines'
  }
};
 
const CONOCIMIENTO_MEDICAMENTOS = {
  'levodopa': {
    nombre: 'Levodopa',
    nombres_comerciales: ['Sinemet', 'Madopar', 'Stalevo'],
    categoria: 'Antiparkinsoniano',
    descripcion: 'Precursor de dopamina, tratamiento principal de Parkinson.',
    interacciones_alimentarias: [
      { tipo: 'proteina_alta', severidad: 'alta', accion: 'separar', ventana: '1h antes o 2h después' },
      { tipo: 'hierro', severidad: 'moderada', accion: 'separar', ventana: '2h' },
      { tipo: 'vitamina_b6_alta', severidad: 'moderada', accion: 'mantener_constante', ventana: 'diaria' }
    ],
    condiciones_para_uso: ['parkinson'],
    fuente: 'Drugs.com / FDA Label'
  },
  'donepezilo': {
    nombre: 'Donepezilo',
    nombres_comerciales: ['Aricept', 'Eranz'],
    categoria: 'Inhibidor de colinesterasa',
    descripcion: 'Tratamiento para deterioro cognitivo en Alzheimer.',
    interacciones_alimentarias: [
      { tipo: 'alcohol', severidad: 'alta', accion: 'evitar' }
    ],
    condiciones_para_uso: ['alzheimer'],
    fuente: 'Drugs.com / FDA Label'
  },
  'warfarina': {
    nombre: 'Warfarina',
    nombres_comerciales: ['Coumadin', 'Jantoven'],
    categoria: 'Anticoagulante',
    descripcion: 'Anticoagulante oral, requiere monitoreo de INR.',
    interacciones_alimentarias: [
      { tipo: 'vitamina_k_alta', severidad: 'alta', accion: 'mantener_constante', ventana: 'consumo diario estable' },
      { tipo: 'omega_3_alto', severidad: 'moderada', accion: 'monitorear', ventana: 'efecto aditivo anticoagulante' }
    ],
    condiciones_para_uso: ['fibrilacion_auricular', 'trombosis'],
    fuente: 'Drugs.com / NIH'
  },
  'furosemida': {
    nombre: 'Furosemida',
    nombres_comerciales: ['Lasix'],
    categoria: 'Diurético de asa',
    descripcion: 'Diurético potente para insuficiencia cardíaca e hipertensión.',
    interacciones_alimentarias: [
      { tipo: 'potasio_alto', severidad: 'moderada', accion: 'monitorear', ventana: 'control electrolitos' },
      { tipo: 'sodio_alto', severidad: 'alta', accion: 'evitar', ventana: 'contraproducente' }
    ],
    condiciones_para_uso: ['insuficiencia_cardiaca', 'hipertension'],
    fuente: 'Drugs.com / FDA Label'
  },
  'metformina': {
    nombre: 'Metformina',
    nombres_comerciales: ['Glucophage', 'Glafornil'],
    categoria: 'Antidiabético oral',
    descripcion: 'Primera línea para diabetes tipo 2.',
    interacciones_alimentarias: [
      { tipo: 'azucares_simples', severidad: 'alta', accion: 'evitar' },
      { tipo: 'vitamina_b12', severidad: 'baja', accion: 'monitorear', ventana: 'uso prolongado reduce absorción' }
    ],
    condiciones_para_uso: ['diabetes'],
    fuente: 'Drugs.com / ADA Guidelines'
  }
};
 
const CONOCIMIENTO_ALERGIAS = {
  'mariscos': {
    nombre: 'Mariscos',
    ingredientes_excluidos: ['camaron', 'langostino', 'cangrejo', 'mejillon', 'ostra'],
    reacciones_cruzadas: ['polvo de pescado', 'colorantes con quitosano'],
    severidad_tipica: 'critica',
    sustitutos_seguros: ['Pollo', 'Pavo', 'Tofu'],
    fuente: 'FARE / NIH Allergy'
  },
  'huevo': {
    nombre: 'Huevo',
    ingredientes_excluidos: ['huevo entero', 'clara', 'yema', 'lecitina de huevo'],
    reacciones_cruzadas: ['mayonesa', 'algunas pastas'],
    severidad_tipica: 'alta',
    sustitutos_seguros: ['Chía hidratada (sustituto en recetas)', 'Linaza'],
    fuente: 'FARE'
  },
  'soya': {
    nombre: 'Soya',
    ingredientes_excluidos: ['tofu', 'salsa de soya', 'edamame', 'lecitina de soya'],
    reacciones_cruzadas: ['legumbres en algunos casos'],
    severidad_tipica: 'moderada',
    sustitutos_seguros: ['Garbanzo', 'Lenteja', 'Quinoa'],
    fuente: 'FARE'
  }
};
 
const CONOCIMIENTO_OBJETIVOS = {
  'sarcopenia': {
    nombre: 'Sarcopenia (pérdida muscular)',
    descripcion: 'Pérdida progresiva de masa y fuerza muscular asociada al envejecimiento.',
    ingredientes_prioritarios: ['Salmón', 'Pollo', 'Huevo', 'Quinoa', 'Lentejas'],
    nutrientes_clave: ['proteina_completa', 'leucina', 'vitamina_d', 'omega_3'],
    ingredientes_contraproducentes: [],
    condiciones_relacionadas: ['parkinson', 'epoc'],
    fuente: 'NIH NIA / Sarcopenia Consensus Statement'
  },
  'estrenimiento': {
    nombre: 'Estreñimiento',
    descripcion: 'Dificultad para evacuar, común en adultos mayores y pacientes con Parkinson.',
    ingredientes_prioritarios: ['Chía', 'Avena', 'Frutos rojos', 'Camote'],
    nutrientes_clave: ['fibra_soluble', 'fibra_insoluble', 'agua'],
    ingredientes_contraproducentes: ['arroz_blanco', 'lacteos_excesivos'],
    condiciones_relacionadas: ['parkinson'],
    fuente: 'NIH / Mayo Clinic'
  },
  'control_glucemico': {
    nombre: 'Control glucémico',
    descripcion: 'Mantenimiento de niveles estables de glucosa en sangre.',
    ingredientes_prioritarios: ['Aguacate', 'Lentejas', 'Quinoa', 'Salmón'],
    nutrientes_clave: ['fibra_soluble', 'proteina', 'grasa_saludable'],
    ingredientes_contraproducentes: ['azucares_simples', 'carbohidratos_refinados'],
    condiciones_relacionadas: ['diabetes'],
    fuente: 'ADA / NIH NIDDK'
  },
  'antiinflamatorio': {
    nombre: 'Antiinflamatorio sistémico',
    descripcion: 'Reducción de inflamación crónica de bajo grado.',
    ingredientes_prioritarios: ['Salmón', 'Cúrcuma', 'Frutos rojos', 'Kale', 'Cacao'],
    nutrientes_clave: ['omega_3', 'polifenoles', 'curcumina'],
    ingredientes_contraproducentes: ['azucares_simples', 'grasas_trans'],
    condiciones_relacionadas: ['alzheimer', 'parkinson'],
    fuente: 'NIH / Dieta antiinflamatoria mediterránea'
  }
};
 
// ═══════════════════════════════════════════════════════════════
// PARSER CSV
// ═══════════════════════════════════════════════════════════════
 
function parsearCSV(texto) {
  const lineas = texto.trim().split(/\r?\n/);
  if (lineas.length < 2) return { headers: [], rows: [] };
  
  const parseLinea = (linea) => {
    const result = [];
    let actual = '';
    let dentroComillas = false;
    for (let i = 0; i < linea.length; i++) {
      const char = linea[i];
      if (char === '"') {
        dentroComillas = !dentroComillas;
      } else if (char === ',' && !dentroComillas) {
        result.push(actual.trim());
        actual = '';
      } else {
        actual += char;
      }
    }
    result.push(actual.trim());
    return result;
  };
 
  const headers = parseLinea(lineas[0]);
  const rows = lineas.slice(1).map(linea => {
    const valores = parseLinea(linea);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = valores[i] || ''; });
    return obj;
  });
  return { headers, rows };
}
 
function parsearLista(valor) {
  if (!valor) return [];
  return valor.split('|').map(s => s.trim()).filter(Boolean);
}
 
function parsearIngredientes(valor) {
  if (!valor) return [];
  return valor.split('|').map(item => {
    const [nombre, gramos] = item.split(':').map(s => s.trim());
    return { nombre, cantidadG: parseInt(gramos) || 0 };
  }).filter(i => i.nombre);
}
 
function parsearProceso(valor) {
  if (!valor) return [];
  return valor.split('::').map((paso, idx) => {
    const partes = paso.split('/').map(s => s.trim());
    return {
      paso: idx + 1,
      accion: partes[0] || '',
      ingrediente: partes[1] || '',
      tiempo: partes[2] ? parseInt(partes[2]) || null : null,
      temperatura: partes[3] ? parseInt(partes[3]) || null : null,
      nota: partes[4] || ''
    };
  });
}
 
function transformarFilaReceta(row, ingredientesCatalogo) {
  // Mapear ingredientes por nombre a IDs
  const buscarIdPorNombre = (nombre) => {
    const ing = ingredientesCatalogo.find(i => i.nombre.toLowerCase() === nombre.toLowerCase());
    return ing ? ing.id : null;
  };
 
  const mapearIngredientes = (lista) => {
    return lista.map(i => ({
      id: buscarIdPorNombre(i.nombre),
      cantidadG: i.cantidadG,
      nombreOriginal: i.nombre
    }));
  };
 
  const baseRaw = mapearIngredientes(parsearIngredientes(row.ingredientes_base));
  const removiblesRaw = mapearIngredientes(parsearIngredientes(row.ingredientes_removibles));
  const anadiblesRaw = mapearIngredientes(parsearIngredientes(row.ingredientes_anadibles));
 
  const ingredientesNoEncontrados = [
    ...baseRaw.filter(i => !i.id).map(i => i.nombreOriginal),
    ...removiblesRaw.filter(i => !i.id).map(i => i.nombreOriginal),
    ...anadiblesRaw.filter(i => !i.id).map(i => i.nombreOriginal),
  ];
 
  return {
    nombre: row.nombre,
    momentosDia: parsearLista(row.momentos_dia),
    baseSabor: row.base_sabor,
    temperaturaServicio: row.temperatura_servicio,
    tiempoTotal: parseInt(row.tiempo_total_min) || 0,
    iddsiResultante: parseInt(row.iddsi_base) || 5,
    iddsiMinimo: parseInt(row.iddsi_minimo) || 4,
    porcionesBase: parseInt(row.porciones_base) || 5,
    base: baseRaw.filter(i => i.id).map(({ id, cantidadG }) => ({ id, cantidadG })),
    removibles: removiblesRaw.filter(i => i.id).map(({ id, cantidadG }) => ({ id, cantidadG })),
    anadibles: anadiblesRaw.filter(i => i.id).map(({ id, cantidadG }) => ({ id, cantidadG })),
    objetivosClinicos: parsearLista(row.objetivos_clinicos),
    funcionNutricional: parsearLista(row.funcion_nutricional),
    accionCerebral: parsearLista(row.accion_cerebral),
    tecnicas: parsearLista(row.tecnicas),
    modificacionesAceptadas: parsearLista(row.modificaciones_aceptadas),
    proceso: parsearProceso(row.proceso),
    texturaEsperada: row.textura_esperada,
    notasCriticas: parsearLista(row.notas_criticas),
    validado: true,
    _advertencias: ingredientesNoEncontrados.length > 0 ? [`Ingredientes no encontrados en catálogo: ${ingredientesNoEncontrados.join(', ')}`] : []
  };
}
 
function transformarFilaPaciente(row) {
  return {
    nombre: row.nombre,
    habitacion: row.habitacion,
    edad: parseInt(row.edad) || 0,
    iddsi: parseInt(row.nivel_iddsi) || 5,
    condiciones: parsearLista(row.condiciones_medicas),
    medicamentos: parsearLista(row.medicamentos),
    alergias: parsearLista(row.alergias),
    objetivos: parsearLista(row.objetivos_clinicos),
    aversiones: parsearLista(row.aversiones),
    restriccionesCulturales: parsearLista(row.restricciones_culturales),
    notas: row.notas || '',
    _advertencias: []
  };
}
 
function transformarFilaIngrediente(row) {
  return {
    nombre: row.nombre,
    grupo: row.grupo_alimenticio,
    iddsiBase: parseInt(row.iddsi_base) || 5,
    iddsiMin: parseInt(row.iddsi_minimo) || 4,
    esProteinaPrincipal: row.es_proteina_principal === 'true',
    modificabilidad: row.modificabilidad || 'base',
    baseSabor: row.base_sabor || '',
    contraindicaciones: parsearLista(row.contraindicaciones),
    interacciones: parsearLista(row.interacciones_medicamentos),
    objetivos: parsearLista(row.objetivos_clinicos),
    funcionNutricional: parsearLista(row.funcion_nutricional),
    accionCerebral: parsearLista(row.accion_cerebral),
    pesoBasePorcion: parseInt(row.peso_base_porcion_g) || null,
    notasClinicas: row.notas_clinicas || '',
    fuente: row.fuente || '',
    _advertencias: []
  };
}
 
// ═══════════════════════════════════════════════════════════════
// MODAL DE IMPORTACIÓN CSV
// ═══════════════════════════════════════════════════════════════
 
function ModalImportarCSV({ tipo, ingredientesCatalogo, onSave, onCancel }) {
  const [paso, setPaso] = useState('upload'); // upload → preview → confirmacion
  const [registros, setRegistros] = useState([]);
  const [error, setError] = useState('');
 
  const titulos = {
    receta: 'Importar recetas desde CSV',
    paciente: 'Importar pacientes desde CSV',
    ingrediente: 'Importar ingredientes desde CSV'
  };
 
  const columnasRequeridas = {
    receta: ['nombre', 'momentos_dia', 'base_sabor', 'temperatura_servicio', 'tiempo_total_min', 'iddsi_base', 'iddsi_minimo', 'porciones_base', 'ingredientes_base', 'objetivos_clinicos', 'tecnicas', 'proceso', 'textura_esperada'],
    paciente: ['nombre', 'habitacion', 'edad', 'nivel_iddsi'],
    ingrediente: ['nombre', 'grupo_alimenticio', 'iddsi_base', 'iddsi_minimo', 'es_proteina_principal', 'modificabilidad']
  };
 
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const texto = evt.target.result;
        const { headers, rows } = parsearCSV(texto);
        
        // Validar columnas requeridas
        const faltantes = columnasRequeridas[tipo].filter(c => !headers.includes(c));
        if (faltantes.length > 0) {
          setError(`Faltan columnas requeridas: ${faltantes.join(', ')}`);
          return;
        }
 
        // Transformar filas según tipo
        const transformer = {
          receta: (r) => transformarFilaReceta(r, ingredientesCatalogo),
          paciente: transformarFilaPaciente,
          ingrediente: transformarFilaIngrediente
        }[tipo];
 
        const transformados = rows.filter(r => r.nombre).map(transformer);
        
        if (transformados.length === 0) {
          setError('No se encontraron registros válidos en el archivo');
          return;
        }
 
        setRegistros(transformados);
        setError('');
        setPaso('preview');
      } catch (err) {
        setError('Error al procesar el archivo: ' + err.message);
      }
    };
    reader.readAsText(file);
  };
 
  const actualizarRegistro = (idx, campo, valor) => {
    const nuevos = [...registros];
    nuevos[idx] = { ...nuevos[idx], [campo]: valor };
    setRegistros(nuevos);
  };
 
  const eliminarRegistro = (idx) => {
    setRegistros(registros.filter((_, i) => i !== idx));
  };
 
  const confirmar = () => {
    registros.forEach(r => {
      const { _advertencias, ...resto } = r;
      onSave(resto);
    });
  };
 
  return (
    <div className="fixed inset-0 bg-stone-900/40 z-50 flex items-center justify-center p-6" onClick={onCancel}>
      <div className="bg-white max-w-5xl w-full flex flex-col" style={{ maxHeight: '92vh' }} onClick={e => e.stopPropagation()}>
        <div className="p-8 border-b border-stone-200 flex-shrink-0 flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2">Importación masiva</p>
            <h3 className="font-display text-3xl font-medium text-stone-900">{titulos[tipo]}</h3>
          </div>
          <button onClick={onCancel} className="text-stone-400 hover:text-stone-900">
            <X className="w-5 h-5" />
          </button>
        </div>
 
        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          
          {paso === 'upload' && (
            <div className="p-8">
              <div className="border-2 border-dashed border-stone-300 p-12 text-center bg-stone-50">
                <Upload className="w-10 h-10 text-stone-400 mx-auto mb-4" />
                <p className="font-display text-xl text-stone-900 mb-2">Sube tu archivo CSV</p>
                <p className="text-sm text-stone-600 mb-6">El sistema procesará y mostrará un preview antes de integrar</p>
                <label className="inline-block">
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                  <span className="px-6 py-3 bg-stone-900 text-stone-50 text-xs uppercase tracking-[0.2em] hover:bg-stone-800 cursor-pointer inline-flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />Seleccionar archivo
                  </span>
                </label>
              </div>
 
              {error && (
                <div className="mt-4 bg-red-50 border-l-2 border-red-700 p-4">
                  <p className="text-xs uppercase tracking-wider text-red-900 font-medium mb-1">Error de validación</p>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
 
              <div className="mt-8 bg-stone-50 border border-stone-200 p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-3">Columnas requeridas</p>
                <div className="flex flex-wrap gap-1.5">
                  {columnasRequeridas[tipo].map(c => (
                    <span key={c} className="text-xs px-2 py-1 bg-white border border-stone-200 text-stone-700 font-mono">{c}</span>
                  ))}
                </div>
                <p className="text-xs text-stone-500 mt-3 italic">Consulta el documento "Roadmap de Plantillas" para la estructura completa</p>
              </div>
            </div>
          )}
 
          {paso === 'preview' && (
            <div className="p-8">
              <div className="bg-emerald-50 border-l-2 border-emerald-700 p-4 mb-6">
                <p className="text-xs uppercase tracking-wider text-emerald-900 font-medium mb-1">Archivo procesado</p>
                <p className="text-sm text-emerald-800">{registros.length} registro(s) listo(s) para revisar e integrar</p>
              </div>
 
              <div className="space-y-4">
                {registros.map((reg, idx) => (
                  <PreviewRegistro 
                    key={idx} 
                    registro={reg} 
                    tipo={tipo}
                    onActualizar={(campo, valor) => actualizarRegistro(idx, campo, valor)}
                    onEliminar={() => eliminarRegistro(idx)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
 
        <div className="p-4 border-t border-stone-200 flex-shrink-0 flex gap-2">
          {paso === 'upload' && (
            <button onClick={onCancel} className="w-full py-3 border border-stone-300 text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50">Cancelar</button>
          )}
          {paso === 'preview' && (
            <>
              <button onClick={() => setPaso('upload')} className="flex-1 py-3 border border-stone-300 text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50">Atrás</button>
              <button onClick={confirmar} disabled={registros.length === 0} className="flex-1 py-3 bg-stone-900 text-stone-50 text-xs uppercase tracking-[0.2em] hover:bg-stone-800 disabled:opacity-30">
                Integrar {registros.length} registro{registros.length !== 1 ? 's' : ''}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
 
function PreviewRegistro({ registro, tipo, onActualizar, onEliminar }) {
  const [expandido, setExpandido] = useState(false);
 
  return (
    <div className="border border-stone-200">
      <div className="p-4 bg-stone-50 flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-display text-lg font-medium text-stone-900">{registro.nombre || '(sin nombre)'}</h4>
          {tipo === 'receta' && (
            <p className="text-xs text-stone-600">
              {registro.momentosDia?.join(' · ')} · IDDSI {registro.iddsiMinimo}-{registro.iddsiResultante} · {registro.base?.length} ingredientes base
            </p>
          )}
          {tipo === 'paciente' && (
            <p className="text-xs text-stone-600">
              Hab. {registro.habitacion} · {registro.edad} años · IDDSI {registro.iddsi}
            </p>
          )}
          {tipo === 'ingrediente' && (
            <p className="text-xs text-stone-600">
              {registro.grupo} · IDDSI {registro.iddsiMin}-{registro.iddsiBase}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setExpandido(!expandido)} className="text-xs text-stone-700 hover:underline">
            {expandido ? 'Ocultar' : 'Editar'}
          </button>
          <button onClick={onEliminar} className="text-xs text-red-700 hover:underline">Eliminar</button>
        </div>
      </div>
 
      {registro._advertencias && registro._advertencias.length > 0 && (
        <div className="bg-amber-50 border-l-2 border-amber-600 p-3">
          {registro._advertencias.map((adv, i) => (
            <p key={i} className="text-xs text-amber-900">
              <AlertTriangle className="w-3 h-3 inline mr-1" />{adv}
            </p>
          ))}
        </div>
      )}
 
      {expandido && (
        <div className="p-4 bg-white space-y-3 border-t border-stone-200">
          <CampoEditable label="Nombre" valor={registro.nombre} onChange={v => onActualizar('nombre', v)} />
          
          {tipo === 'receta' && (
            <>
              <CampoEditable label="Tiempo total (min)" valor={registro.tiempoTotal} onChange={v => onActualizar('tiempoTotal', parseInt(v) || 0)} type="number" />
              <CampoEditable label="Textura esperada" valor={registro.texturaEsperada} onChange={v => onActualizar('texturaEsperada', v)} />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Momentos del día</p>
                <p className="text-xs text-stone-700">{registro.momentosDia?.join(', ')}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Objetivos clínicos</p>
                <p className="text-xs text-stone-700">{registro.objetivosClinicos?.join(', ')}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Proceso ({registro.proceso?.length} pasos)</p>
                {registro.proceso?.map((p, i) => (
                  <p key={i} className="text-xs text-stone-700">
                    {p.paso}. <span className="font-medium">{p.accion}</span> {p.ingrediente}
                    {p.tiempo && <span className="text-stone-500"> · {p.tiempo} min</span>}
                    {p.temperatura && <span className="text-stone-500"> · {p.temperatura}°C</span>}
                  </p>
                ))}
              </div>
            </>
          )}
 
          {tipo === 'paciente' && (
            <>
              <CampoEditable label="Habitación" valor={registro.habitacion} onChange={v => onActualizar('habitacion', v)} />
              <CampoEditable label="Edad" valor={registro.edad} onChange={v => onActualizar('edad', parseInt(v) || 0)} type="number" />
              <CampoEditable label="Nivel IDDSI" valor={registro.iddsi} onChange={v => onActualizar('iddsi', parseInt(v) || 5)} type="number" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Condiciones</p>
                <p className="text-xs text-stone-700">{registro.condiciones?.join(', ') || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Medicamentos</p>
                <p className="text-xs text-stone-700">{registro.medicamentos?.join(', ') || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Alergias</p>
                <p className="text-xs text-red-700">{registro.alergias?.join(', ') || '—'}</p>
              </div>
            </>
          )}
 
          {tipo === 'ingrediente' && (
            <>
              <CampoEditable label="Grupo alimenticio" valor={registro.grupo} onChange={v => onActualizar('grupo', v)} />
              <CampoEditable label="Peso base por porción (g)" valor={registro.pesoBasePorcion} onChange={v => onActualizar('pesoBasePorcion', parseInt(v) || null)} type="number" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Contraindicaciones</p>
                <p className="text-xs text-stone-700">{registro.contraindicaciones?.join(', ') || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Interacciones</p>
                <p className="text-xs text-stone-700">{registro.interacciones?.join(', ') || '—'}</p>
              </div>
              <CampoEditable label="Fuente clínica" valor={registro.fuente} onChange={v => onActualizar('fuente', v)} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
 
function CampoEditable({ label, valor, onChange, type = 'text' }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">{label}</p>
      <input 
        type={type} 
        value={valor || ''} 
        onChange={e => onChange(e.target.value)}
        className="w-full px-2 py-1.5 border border-stone-300 bg-white text-sm focus:outline-none focus:border-stone-900"
      />
    </div>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ═══════════════════════════════════════════════════════════════
 
export default function App() {
  const [modo, setModo] = useState(null); // null | 'cocina' | 'clinico'
  const [sesionClinicaValidada, setSesionClinicaValidada] = useState(false);
  const [vista, setVista] = useState('chef');
  const [vistaClinica, setVistaClinica] = useState('inicio');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [ingredientes, setIngredientes] = useState(INGREDIENTES_INICIALES);
  const [recetas, setRecetas] = useState(RECETAS_INICIALES);
  const [pacientes, setPacientes] = useState(PACIENTES_INICIALES);
  const [ciclo, setCiclo] = useState(() => crearCicloVacio());
  
  // Navegación dentro del ciclo: null = vista macro, objeto = editando un día
  const [diaEditando, setDiaEditando] = useState(null); // { semana: 1, dia: 'lunes' }
  const [momentoActivo, setMomentoActivo] = useState('almuerzo');
 
  // Caminos del momento/día actualmente en edición
  const caminosSeleccionados = useMemo(() => {
    if (!diaEditando) return [null, null, null];
    const dia = obtenerCaminosDelDia(ciclo, diaEditando.semana, diaEditando.dia);
    if (!dia) return [null, null, null];
    return dia.tiempos[momentoActivo] || [null, null, null];
  }, [ciclo, diaEditando, momentoActivo]);
 
  const setCaminosSeleccionados = (nuevos) => {
    if (!diaEditando) return;
    setCiclo(prev => actualizarCaminosDelDia(prev, diaEditando.semana, diaEditando.dia, momentoActivo, nuevos));
  };
 
  const evaluacion = useMemo(() => {
    const recetasSel = caminosSeleccionados.map(id => id ? recetas.find(r => r.id === id) : null);
    if (recetasSel.every(r => r === null)) return null;
    return evaluarCobertura(recetasSel, pacientes, ingredientes);
  }, [caminosSeleccionados, recetas, pacientes, ingredientes]);
 
  const asignaciones = useMemo(() => evaluacion ? asignarPacientesACaminos(evaluacion) : null, [evaluacion]);
 
  const ingresarCocina = () => { setModo('cocina'); };
  const ingresarClinico = (password) => {
    if (password === PASSWORD_CLINICO) {
      setModo('clinico');
      setSesionClinicaValidada(true);
      setMostrarPassword(false);
      return true;
    }
    return false;
  };
 
  const intentarCambiarAClinico = () => {
    if (sesionClinicaValidada) {
      setModo('clinico');
    } else {
      setMostrarPassword(true);
    }
  };
 
  const cambiarACocina = () => { setModo('cocina'); };
 
  const cerrarSesion = () => {
    setModo(null);
    setSesionClinicaValidada(false);
  };
 
  if (modo === null) {
    return <PantallaLogin onCocina={ingresarCocina} onClinico={ingresarClinico} />;
  }
 
  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter+Tight:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'Fraunces', Georgia, serif; font-feature-settings: 'ss01' on; }
        .grain { background-image: radial-gradient(circle at 1px 1px, rgba(0,0,0,0.015) 1px, transparent 0); background-size: 24px 24px; }
      `}</style>
 
      <Header modo={modo} onCambiarModo={modo === 'cocina' ? intentarCambiarAClinico : cambiarACocina} onCerrarSesion={cerrarSesion} sesionClinicaValidada={sesionClinicaValidada} />
 
      <main className="max-w-7xl mx-auto px-6 py-8 grain">
        {modo === 'cocina' && (
          <AppCocina 
            recetas={recetas} 
            pacientes={pacientes} 
            ingredientes={ingredientes} 
            vista={vista} 
            setVista={setVista} 
            caminosSeleccionados={caminosSeleccionados} 
            setCaminosSeleccionados={setCaminosSeleccionados} 
            evaluacion={evaluacion} 
            asignaciones={asignaciones} 
            momentoActivo={momentoActivo} 
            setMomentoActivo={setMomentoActivo} 
            ciclo={ciclo}
            setCiclo={setCiclo}
            diaEditando={diaEditando}
            setDiaEditando={setDiaEditando}
          />
        )}
        {modo === 'clinico' && (
          <AppClinico recetas={recetas} setRecetas={setRecetas} pacientes={pacientes} setPacientes={setPacientes} ingredientes={ingredientes} setIngredientes={setIngredientes} vista={vistaClinica} setVista={setVistaClinica} />
        )}
      </main>
 
      {mostrarPassword && (
        <ModalPassword onSubmit={ingresarClinico} onCancel={() => setMostrarPassword(false)} />
      )}
    </div>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// PANTALLA DE LOGIN
// ═══════════════════════════════════════════════════════════════
 
function PantallaLogin({ onCocina, onClinico }) {
  const [modoSeleccionado, setModoSeleccionado] = useState('cocina');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
 
  const handleSubmit = () => {
    if (modoSeleccionado === 'cocina') {
      onCocina();
    } else {
      const ok = onClinico(password);
      if (!ok) setError(true);
    }
  };
 
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter+Tight:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'Fraunces', Georgia, serif; }
      `}</style>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="w-14 h-14 bg-stone-900 rounded-sm flex items-center justify-center mx-auto mb-6">
            <Activity className="w-7 h-7 text-stone-50" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-4xl font-medium text-stone-900 mb-2">Mensa Clínica</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Sistema de Formulación Nutricional</p>
        </div>
 
        <div className="bg-white border border-stone-200 p-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-4">¿Desde dónde trabajas hoy?</p>
          
          <div className="bg-stone-100 p-1 flex mb-6">
            <button 
              onClick={() => { setModoSeleccionado('cocina'); setError(false); setPassword(''); }}
              className={`flex-1 py-3 text-xs uppercase tracking-wider font-medium transition flex items-center justify-center gap-2 ${modoSeleccionado === 'cocina' ? 'bg-stone-900 text-stone-50' : 'text-stone-600'}`}
            >
              <ChefHat className="w-3.5 h-3.5" />Cocina
            </button>
            <button 
              onClick={() => { setModoSeleccionado('clinico'); setError(false); }}
              className={`flex-1 py-3 text-xs uppercase tracking-wider font-medium transition flex items-center justify-center gap-2 ${modoSeleccionado === 'clinico' ? 'bg-stone-900 text-stone-50' : 'text-stone-600'}`}
            >
              <Stethoscope className="w-3.5 h-3.5" />Clínico
            </button>
          </div>
 
          {modoSeleccionado === 'cocina' && (
            <div className="space-y-4">
              <p className="text-sm text-stone-600 leading-relaxed">
                Acceso directo a diseño de caminos, catálogo y hoja de servicio.
              </p>
              <button onClick={handleSubmit} className="w-full py-3 bg-stone-900 text-stone-50 text-xs uppercase tracking-[0.2em] hover:bg-stone-800 flex items-center justify-center gap-2">
                Ingresar a Cocina <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
 
          {modoSeleccionado === 'clinico' && (
            <div className="space-y-4">
              <p className="text-sm text-stone-600 leading-relaxed">
                Requiere contraseña. Acceso completo a catálogo, ingredientes y pacientes.
              </p>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-stone-500 block mb-2 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />Contraseña
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className={`w-full px-3 py-2.5 border text-sm focus:outline-none ${error ? 'border-red-500 bg-red-50' : 'border-stone-300 bg-stone-50 focus:border-stone-900'}`}
                  placeholder="Ingresar contraseña"
                  autoFocus
                />
                {error && <p className="text-xs text-red-700 mt-1">Contraseña incorrecta</p>}
                <p className="text-[10px] text-stone-400 mt-2 italic">Demo: clinico2025</p>
              </div>
              <button onClick={handleSubmit} className="w-full py-3 bg-stone-900 text-stone-50 text-xs uppercase tracking-[0.2em] hover:bg-stone-800 flex items-center justify-center gap-2">
                Ingresar a Clínico <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// MODAL DE CONTRASEÑA (transición cocina → clínico)
// ═══════════════════════════════════════════════════════════════
 
function ModalPassword({ onSubmit, onCancel }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
 
  const handleSubmit = () => {
    const ok = onSubmit(password);
    if (!ok) setError(true);
  };
 
  return (
    <div className="fixed inset-0 bg-stone-900/40 z-50 flex items-center justify-center p-6" onClick={onCancel}>
      <div className="bg-white max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-stone-900 rounded-sm flex items-center justify-center">
            <Lock className="w-5 h-5 text-stone-50" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">Acceso restringido</p>
            <h3 className="font-display text-xl font-medium text-stone-900">Modo Clínico</h3>
          </div>
        </div>
        <p className="text-sm text-stone-600 mb-4">Ingresa la contraseña de la nutricionista para acceder.</p>
        <input 
          type="password" 
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className={`w-full px-3 py-2.5 border text-sm focus:outline-none mb-2 ${error ? 'border-red-500 bg-red-50' : 'border-stone-300 bg-stone-50 focus:border-stone-900'}`}
          placeholder="Contraseña"
          autoFocus
        />
        {error && <p className="text-xs text-red-700 mb-3">Contraseña incorrecta</p>}
        <p className="text-[10px] text-stone-400 mb-4 italic">Demo: clinico2025</p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 py-2.5 border border-stone-300 text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50">Cancelar</button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider hover:bg-stone-800">Ingresar</button>
        </div>
      </div>
    </div>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════════════
 
function Header({ modo, onCambiarModo, onCerrarSesion, sesionClinicaValidada }) {
  const otroModo = modo === 'cocina' ? 'Clínico' : 'Cocina';
  const OtroIcon = modo === 'cocina' ? Stethoscope : ChefHat;
  const requierePassword = modo === 'cocina' && !sesionClinicaValidada;
 
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-stone-900 rounded-sm flex items-center justify-center">
            <Activity className="w-5 h-5 text-stone-50" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-stone-900 leading-none">Mensa Clínica</h1>
            <p className="text-[10px] uppercase tracking-widest text-stone-500 mt-0.5">
              Modo {modo === 'cocina' ? 'Cocina' : 'Clínico'}
              {sesionClinicaValidada && modo === 'cocina' && <span className="ml-2 text-emerald-700">· sesión clínica activa</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onCambiarModo} className="px-4 py-2 border border-stone-300 text-xs uppercase tracking-wider font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-2">
            <OtroIcon className="w-3.5 h-3.5" />
            Ir a {otroModo}
            {requierePassword && <Lock className="w-3 h-3 text-stone-500" />}
          </button>
          <button onClick={onCerrarSesion} className="px-4 py-2 text-xs uppercase tracking-wider font-medium text-stone-500 hover:text-stone-900">
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// APP COCINA
// ═══════════════════════════════════════════════════════════════
 
function AppCocina({ recetas, pacientes, ingredientes, vista, setVista, caminosSeleccionados, setCaminosSeleccionados, evaluacion, asignaciones, momentoActivo, setMomentoActivo, ciclo, setCiclo, diaEditando, setDiaEditando }) {
  return (
    <>
      <div className="mb-8 flex items-center gap-1 bg-stone-100 p-1 rounded-sm w-fit">
        <button onClick={() => setVista('chef')} className={`px-4 py-1.5 text-xs uppercase tracking-wider font-medium transition ${vista === 'chef' ? 'bg-stone-900 text-stone-50' : 'text-stone-600 hover:text-stone-900'}`}>
          <ChefHat className="w-3.5 h-3.5 inline mr-1.5" />Ciclo del menú
        </button>
        <button onClick={() => setVista('catalogo')} className={`px-4 py-1.5 text-xs uppercase tracking-wider font-medium transition ${vista === 'catalogo' ? 'bg-stone-900 text-stone-50' : 'text-stone-600 hover:text-stone-900'}`}>
          <BookOpen className="w-3.5 h-3.5 inline mr-1.5" />Catálogo
        </button>
        <button onClick={() => setVista('pacientes')} className={`px-4 py-1.5 text-xs uppercase tracking-wider font-medium transition ${vista === 'pacientes' ? 'bg-stone-900 text-stone-50' : 'text-stone-600 hover:text-stone-900'}`}>
          <Users className="w-3.5 h-3.5 inline mr-1.5" />Pacientes
        </button>
      </div>
 
      {vista === 'chef' && !diaEditando && (
        <VistaCicloMacro 
          ciclo={ciclo}
          setCiclo={setCiclo}
          pacientes={pacientes}
          ingredientes={ingredientes}
          recetas={recetas}
          onEditarDia={(semana, dia) => setDiaEditando({ semana, dia })}
        />
      )}
      {vista === 'chef' && diaEditando && (
        <VistaEditorDia
          ciclo={ciclo}
          diaEditando={diaEditando}
          onVolver={() => setDiaEditando(null)}
          recetas={recetas} 
          pacientes={pacientes} 
          ingredientes={ingredientes} 
          caminosSeleccionados={caminosSeleccionados} 
          setCaminosSeleccionados={setCaminosSeleccionados} 
          evaluacion={evaluacion} 
          asignaciones={asignaciones} 
          momentoActivo={momentoActivo} 
          setMomentoActivo={setMomentoActivo}
        />
      )}
      {vista === 'catalogo' && <VistaCatalogo recetas={recetas} ingredientes={ingredientes} pacientes={pacientes} soloLectura={true} />}
      {vista === 'pacientes' && <VistaPacientes pacientes={pacientes} soloLectura={true} />}
    </>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// VISTA MACRO DEL CICLO
// ═══════════════════════════════════════════════════════════════
 
function VistaCicloMacro({ ciclo, setCiclo, pacientes, ingredientes, recetas, onEditarDia }) {
  const hoyEnCiclo = useMemo(() => calcularHoyEnCiclo(ciclo), [ciclo]);
  
  // Calcular estados de cada día
  const estadosDias = useMemo(() => {
    const estados = {};
    ciclo.semanas.forEach(semana => {
      DIAS_SEMANA.forEach(dia => {
        const diaData = semana.dias[dia];
        estados[`${semana.numero}-${dia}`] = calcularEstadoDia(diaData, pacientes, ingredientes, recetas);
      });
    });
    return estados;
  }, [ciclo, pacientes, ingredientes, recetas]);
 
  // Estadísticas globales
  const stats = useMemo(() => {
    let aprobados = 0, observacion = 0, noAprobados = 0, parciales = 0, vacios = 0;
    Object.values(estadosDias).forEach(estado => {
      if (estado === 'aprobado') aprobados++;
      else if (estado === 'observacion') observacion++;
      else if (estado === 'no_aprobado') noAprobados++;
      else if (estado === 'parcial') parciales++;
      else vacios++;
    });
    return { aprobados, observacion, noAprobados, parciales, vacios, total: 28 };
  }, [estadosDias]);
 
  const irAHoy = () => {
    onEditarDia(hoyEnCiclo.semana, hoyEnCiclo.dia);
  };
 
  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2">Planificación nutricional</p>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-4xl font-medium text-stone-900 leading-none">{ciclo.nombre}</h2>
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-emerald-100 text-emerald-800">Activo</span>
            </div>
            <p className="text-sm text-stone-600 mt-2">{ciclo.duracionSemanas} semanas · {ciclo.duracionSemanas * 7} días · {stats.aprobados + stats.observacion}/{stats.total} días planificados</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={irAHoy} className="px-4 py-2 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider hover:bg-stone-800 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />Ir a hoy
            </button>
          </div>
        </div>
 
        {/* Leyenda */}
        <div className="mt-6 flex items-center gap-6 text-xs text-stone-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Aprobado ({stats.aprobados})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Observación ({stats.observacion})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <span>No aprobado ({stats.noAprobados})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
            <span>Parcial ({stats.parciales})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-200" />
            <span>Vacío ({stats.vacios})</span>
          </div>
        </div>
      </div>
 
      {/* Tabla macro 4x7 */}
      <div className="bg-white border border-stone-200">
        {/* Header con días */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-stone-200">
          <div className="p-3 text-[10px] uppercase tracking-wider text-stone-500 font-medium" />
          {DIAS_SEMANA.map(dia => (
            <div key={dia} className="p-3 text-center text-[10px] uppercase tracking-wider text-stone-500 font-medium border-l border-stone-100">
              {DIAS_LABEL_CORTO[dia]}
            </div>
          ))}
        </div>
 
        {/* Filas: una por semana */}
        {ciclo.semanas.map(semana => (
          <div key={semana.numero} className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-stone-100 last:border-b-0">
            <div className="p-4 flex items-center text-xs uppercase tracking-wider text-stone-600 font-medium border-r border-stone-100">
              S{semana.numero}
            </div>
            {DIAS_SEMANA.map(dia => {
              const estado = estadosDias[`${semana.numero}-${dia}`];
              const esHoy = hoyEnCiclo.semana === semana.numero && hoyEnCiclo.dia === dia;
              return (
                <CeldaDia
                  key={dia}
                  ciclo={ciclo}
                  semana={semana.numero}
                  dia={dia}
                  estado={estado}
                  esHoy={esHoy}
                  recetas={recetas}
                  onEditar={() => onEditarDia(semana.numero, dia)}
                />
              );
            })}
          </div>
        ))}
      </div>
 
      <p className="text-xs text-stone-500 italic">Click en cualquier día para editar sus caminos. El día actual está resaltado con un anillo.</p>
    </div>
  );
}
 
function CeldaDia({ ciclo, semana, dia, estado, esHoy, recetas, onEditar }) {
  const colorEstado = {
    aprobado: 'bg-emerald-500',
    observacion: 'bg-amber-500',
    no_aprobado: 'bg-red-600',
    parcial: 'bg-stone-400',
    vacio: 'bg-stone-200'
  }[estado];
 
  const diaData = ciclo.semanas.find(s => s.numero === semana)?.dias[dia];
  
  // Contar recetas asignadas en este día
  const totalRecetas = diaData ? 
    Object.values(diaData.tiempos).reduce((acc, caminos) => acc + caminos.filter(c => c !== null).length, 0) 
    : 0;
 
  return (
    <button
      onClick={onEditar}
      className={`relative p-3 min-h-[80px] border-l border-stone-100 hover:bg-stone-50 transition text-left ${
        esHoy ? 'ring-2 ring-stone-900 ring-inset' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`w-2.5 h-2.5 rounded-full ${colorEstado}`} />
        {esHoy && <span className="text-[9px] uppercase tracking-wider text-stone-900 font-medium">Hoy</span>}
      </div>
      {totalRecetas > 0 ? (
        <div className="text-xs text-stone-700">
          <p className="font-medium">{totalRecetas} {totalRecetas === 1 ? 'receta' : 'recetas'}</p>
        </div>
      ) : (
        <p className="text-xs text-stone-400">Sin asignar</p>
      )}
    </button>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// VISTA EDITOR DE DÍA (refactorizado de VistaChef)
// ═══════════════════════════════════════════════════════════════
 
function VistaEditorDia({ ciclo, diaEditando, onVolver, recetas, pacientes, ingredientes, caminosSeleccionados, setCaminosSeleccionados, evaluacion, asignaciones, momentoActivo, setMomentoActivo }) {
  return (
    <VistaChef
      recetas={recetas}
      pacientes={pacientes}
      ingredientes={ingredientes}
      caminosSeleccionados={caminosSeleccionados}
      setCaminosSeleccionados={setCaminosSeleccionados}
      evaluacion={evaluacion}
      asignaciones={asignaciones}
      momentoActivo={momentoActivo}
      setMomentoActivo={setMomentoActivo}
      ciclo={ciclo}
      diaEditando={diaEditando}
      onVolver={onVolver}
    />
  );
}
 
// ═══════════════════════════════════════════════════════════════
// APP CLÍNICO
// ═══════════════════════════════════════════════════════════════
 
function AppClinico({ recetas, setRecetas, pacientes, setPacientes, ingredientes, setIngredientes, vista, setVista }) {
  return (
    <>
      <div className="mb-8 flex items-center gap-1 bg-stone-100 p-1 rounded-sm w-fit">
        <button onClick={() => setVista('inicio')} className={`px-4 py-1.5 text-xs uppercase tracking-wider font-medium transition ${vista === 'inicio' ? 'bg-stone-900 text-stone-50' : 'text-stone-600 hover:text-stone-900'}`}>
          <Activity className="w-3.5 h-3.5 inline mr-1.5" />Inicio
        </button>
        <button onClick={() => setVista('recetas')} className={`px-4 py-1.5 text-xs uppercase tracking-wider font-medium transition ${vista === 'recetas' ? 'bg-stone-900 text-stone-50' : 'text-stone-600 hover:text-stone-900'}`}>
          <BookOpen className="w-3.5 h-3.5 inline mr-1.5" />Recetas
        </button>
        <button onClick={() => setVista('ingredientes')} className={`px-4 py-1.5 text-xs uppercase tracking-wider font-medium transition ${vista === 'ingredientes' ? 'bg-stone-900 text-stone-50' : 'text-stone-600 hover:text-stone-900'}`}>
          <span className="inline-block w-3.5 h-3.5 mr-1.5 align-middle">🌿</span>Ingredientes
        </button>
        <button onClick={() => setVista('pacientes')} className={`px-4 py-1.5 text-xs uppercase tracking-wider font-medium transition ${vista === 'pacientes' ? 'bg-stone-900 text-stone-50' : 'text-stone-600 hover:text-stone-900'}`}>
          <Users className="w-3.5 h-3.5 inline mr-1.5" />Pacientes
        </button>
        <button onClick={() => setVista('inbox')} className={`px-4 py-1.5 text-xs uppercase tracking-wider font-medium transition ${vista === 'inbox' ? 'bg-stone-900 text-stone-50' : 'text-stone-600 hover:text-stone-900'}`}>
          <Inbox className="w-3.5 h-3.5 inline mr-1.5" />Inbox
        </button>
      </div>
 
      {vista === 'inicio' && <DashboardClinico recetas={recetas} pacientes={pacientes} ingredientes={ingredientes} setVista={setVista} />}
      {vista === 'recetas' && <VistaCatalogo recetas={recetas} setRecetas={setRecetas} ingredientes={ingredientes} pacientes={pacientes} soloLectura={false} editable={true} />}
      {vista === 'ingredientes' && <VistaIngredientes ingredientes={ingredientes} setIngredientes={setIngredientes} editable={true} />}
      {vista === 'pacientes' && <VistaPacientes pacientes={pacientes} setPacientes={setPacientes} soloLectura={false} editable={true} />}
      {vista === 'inbox' && <VistaInbox />}
    </>
  );
}
 
function DashboardClinico({ recetas, pacientes, ingredientes, setVista }) {
  const pacientesConCobertura = pacientes.map(p => {
    const cobertura = recetas.filter(r => evaluarRecetaParaPaciente(r, p, ingredientes).compatible).length;
    return { paciente: p, cobertura };
  });
 
  const pacientesBajaCobertura = pacientesConCobertura.filter(pc => pc.cobertura < 3);
 
  return (
    <div className="space-y-8">
      <div className="border-b border-stone-200 pb-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2">Panel clínico</p>
        <h2 className="font-display text-4xl font-medium text-stone-900 leading-none">Inicio</h2>
        <p className="text-sm text-stone-600 mt-2">Estado general del catálogo y los pacientes</p>
      </div>
 
      <div className="grid grid-cols-3 gap-4">
        <button onClick={() => setVista('recetas')} className="bg-white border border-stone-200 p-6 text-left hover:border-stone-900 transition">
          <BookOpen className="w-5 h-5 text-stone-700 mb-3" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-1">Recetas matriz</p>
          <p className="font-display text-3xl font-medium text-stone-900">{recetas.length}</p>
          <p className="text-xs text-stone-500 mt-1">validadas</p>
        </button>
        <button onClick={() => setVista('ingredientes')} className="bg-white border border-stone-200 p-6 text-left hover:border-stone-900 transition">
          <span className="text-xl mb-3 block">🌿</span>
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-1">Ingredientes</p>
          <p className="font-display text-3xl font-medium text-stone-900">{ingredientes.length}</p>
          <p className="text-xs text-stone-500 mt-1">en catálogo</p>
        </button>
        <button onClick={() => setVista('pacientes')} className="bg-white border border-stone-200 p-6 text-left hover:border-stone-900 transition">
          <Users className="w-5 h-5 text-stone-700 mb-3" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-1">Pacientes</p>
          <p className="font-display text-3xl font-medium text-stone-900">{pacientes.length}</p>
          <p className="text-xs text-stone-500 mt-1">activos</p>
        </button>
      </div>
 
      <div>
        <h3 className="font-display text-2xl font-medium text-stone-900 mb-4">Cobertura de catálogo por paciente</h3>
        <div className="bg-white border border-stone-200">
          {pacientesConCobertura.map(({ paciente, cobertura }) => {
            const porcentaje = (cobertura / recetas.length) * 100;
            const estado = cobertura >= 3 ? 'ok' : cobertura >= 1 ? 'bajo' : 'critico';
            return (
              <div key={paciente.id} className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-900">{paciente.nombre}</p>
                  <p className="text-xs text-stone-500">Hab. {paciente.habitacion} · IDDSI {paciente.iddsi}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-1.5 bg-stone-100">
                    <div className={`h-full ${estado === 'ok' ? 'bg-emerald-600' : estado === 'bajo' ? 'bg-amber-600' : 'bg-red-600'}`} style={{ width: porcentaje + '%' }} />
                  </div>
                  <span className="text-sm font-medium text-stone-700 w-12 text-right">{cobertura}/{recetas.length}</span>
                </div>
              </div>
            );
          })}
        </div>
        {pacientesBajaCobertura.length > 0 && (
          <div className="mt-4 bg-amber-50 border-l-2 border-amber-600 p-4 text-sm text-stone-800">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700 inline mr-2" />
            {pacientesBajaCobertura.length} paciente(s) con cobertura insuficiente. Considera ampliar el catálogo.
          </div>
        )}
      </div>
    </div>
  );
}
 
function VistaIngredientes({ ingredientes, setIngredientes, editable }) {
  const [mostrarImportar, setMostrarImportar] = useState(false);
 
  const importarIngrediente = (nuevo) => {
    setIngredientes(prev => [...prev, { ...nuevo, id: Math.max(...prev.map(i => i.id), 0) + 1 }]);
  };
 
  return (
    <div className="space-y-8">
      <div className="border-b border-stone-200 pb-6 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2">Catálogo base</p>
          <h2 className="font-display text-4xl font-medium text-stone-900 leading-none">Ingredientes</h2>
          <p className="text-sm text-stone-600 mt-2">{ingredientes.length} ingredientes validados clínicamente</p>
        </div>
        {editable && setIngredientes && (
          <button onClick={() => setMostrarImportar(true)} className="px-4 py-2 border border-stone-300 text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50 flex items-center gap-2">
            <Upload className="w-3.5 h-3.5" />Importar CSV
          </button>
        )}
      </div>
      <div className="bg-white border border-stone-200">
        <div className="grid grid-cols-7 gap-4 px-6 py-3 border-b border-stone-200 text-[10px] uppercase tracking-wider text-stone-500 font-medium">
          <div>Nombre</div><div>Grupo</div><div>IDDSI base</div><div>IDDSI mín.</div><div>Contraindicaciones</div><div>Interacciones</div><div>Objetivos</div>
        </div>
        {ingredientes.map(ing => (
          <div key={ing.id} className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-stone-100 hover:bg-stone-50 text-sm">
            <div className="font-medium text-stone-900">{ing.nombre}</div>
            <div className="text-stone-600 text-xs">{ing.grupo}</div>
            <div className="text-stone-600">{ing.iddsiBase}</div>
            <div className="text-stone-600">{ing.iddsiMin}</div>
            <div className="text-xs">
              {ing.contraindicaciones.length === 0 ? <span className="text-stone-400">—</span> : 
                ing.contraindicaciones.map(c => <span key={c} className="text-red-700 mr-1">{CONDICIONES_LABEL[c] || c}</span>)
              }
            </div>
            <div className="text-xs">
              {ing.interacciones.length === 0 ? <span className="text-stone-400">—</span> : 
                ing.interacciones.map(i => <span key={i} className="text-amber-700 mr-1">{i}</span>)
              }
            </div>
            <div className="text-xs text-stone-600">{ing.objetivos.map(o => OBJETIVOS_LABEL[o] || o).join(', ') || '—'}</div>
          </div>
        ))}
      </div>
      {mostrarImportar && <ModalImportarCSV tipo="ingrediente" ingredientesCatalogo={ingredientes} onSave={importarIngrediente} onCancel={() => setMostrarImportar(false)} />}
    </div>
  );
}
 
function VistaInbox() {
  return (
    <div className="space-y-8">
      <div className="border-b border-stone-200 pb-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2">Comunicación interna</p>
        <h2 className="font-display text-4xl font-medium text-stone-900 leading-none">Inbox</h2>
        <p className="text-sm text-stone-600 mt-2">Sugerencias del chef y notificaciones del sistema</p>
      </div>
      <div className="bg-white border border-stone-200 p-12 text-center">
        <Inbox className="w-10 h-10 text-stone-300 mx-auto mb-4" />
        <p className="text-sm text-stone-500">No hay sugerencias pendientes</p>
        <p className="text-xs text-stone-400 mt-2">Cuando el chef envíe ajustes propuestos, aparecerán aquí</p>
      </div>
    </div>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// VISTA: CHEF (diseño del día)
// ═══════════════════════════════════════════════════════════════
 
function VistaChef({ recetas, pacientes, ingredientes, caminosSeleccionados, setCaminosSeleccionados, evaluacion, asignaciones, momentoActivo, setMomentoActivo, ciclo, diaEditando, onVolver }) {
  const setCamino = (idx, recetaId) => { const n = [...caminosSeleccionados]; n[idx] = recetaId; setCaminosSeleccionados(n); };
 
  // Filtrar recetas por momento activo
  const recetasFiltradas = recetas.filter(r => r.momentosDia.includes(momentoActivo));
  const numCaminos = CAMINOS_POR_MOMENTO[momentoActivo];
 
  // Estado de cada momento del día para el navegador superior
  const estadoMomento = (momento) => {
    if (!ciclo || !diaEditando) return 'vacio';
    const dia = obtenerCaminosDelDia(ciclo, diaEditando.semana, diaEditando.dia);
    if (!dia) return 'vacio';
    const caminos = dia.tiempos[momento] || [];
    const algunoSeleccionado = caminos.some(c => c !== null);
    const todosSeleccionados = caminos.length > 0 && caminos.every(c => c !== null);
    if (todosSeleccionados) return 'completo';
    if (algunoSeleccionado) return 'parcial';
    return 'vacio';
  };
 
  return (
    <div className="space-y-8">
      {onVolver && (
        <button onClick={onVolver} className="flex items-center gap-2 text-xs uppercase tracking-wider text-stone-600 hover:text-stone-900">
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />Volver al ciclo
        </button>
      )}
 
      <div className="border-b border-stone-200 pb-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2">
              {diaEditando ? `${ciclo.nombre} · Semana ${diaEditando.semana}` : 'Diseño del servicio'}
            </p>
            <h2 className="font-display text-4xl font-medium text-stone-900 leading-none capitalize">
              {diaEditando ? DIAS_LABEL[diaEditando.dia] : 'Hoy'}
            </h2>
            <p className="text-sm text-stone-600 mt-2">{pacientes.length} pacientes activos</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">Estado del momento</p>
            <p className="font-display text-2xl font-medium mt-1">
              {!evaluacion && <span className="text-stone-400">Pendiente</span>}
              {evaluacion && evaluacion.estado === 'aprobado' && <span className="text-emerald-700">Aprobado</span>}
              {evaluacion && evaluacion.estado === 'observacion' && <span className="text-amber-700">Con observación</span>}
              {evaluacion && evaluacion.estado === 'no_aprobado' && <span className="text-red-700">No aprobado</span>}
            </p>
          </div>
        </div>
 
        {/* Selector de momentos del día */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-sm">
          {ORDEN_MOMENTOS.map(momento => {
            const estado = estadoMomento(momento);
            const activo = momento === momentoActivo;
            return (
              <button
                key={momento}
                onClick={() => setMomentoActivo(momento)}
                className={`flex-1 px-3 py-2.5 text-xs uppercase tracking-wider font-medium transition flex items-center justify-center gap-2 ${
                  activo ? 'bg-stone-900 text-stone-50' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${
                  estado === 'completo' ? 'bg-emerald-500' :
                  estado === 'parcial' ? 'bg-amber-500' :
                  activo ? 'bg-stone-500' : 'bg-stone-300'
                }`} />
                {MOMENTOS_LABEL[momento]}
              </button>
            );
          })}
        </div>
      </div>
 
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-3">
          {numCaminos} camino{numCaminos !== 1 ? 's' : ''} para {MOMENTOS_LABEL[momentoActivo]}
        </p>
        <div className={`grid gap-4 ${numCaminos === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {Array.from({ length: numCaminos }).map((_, idx) => (
            <CaminoCard 
              key={`${momentoActivo}-${idx}`} 
              numero={idx + 1} 
              recetaSeleccionada={caminosSeleccionados[idx]} 
              recetas={recetasFiltradas} 
              evaluacion={evaluacion && evaluacion.resultados[idx]} 
              asignaciones={asignaciones && asignaciones[idx]} 
              onSelect={(id) => setCamino(idx, id)} 
            />
          ))}
        </div>
        {recetasFiltradas.length === 0 && (
          <div className="mt-4 bg-amber-50 border-l-2 border-amber-600 p-4">
            <p className="text-xs uppercase tracking-wider text-amber-900 font-medium mb-1">Sin recetas disponibles</p>
            <p className="text-sm text-amber-800">No hay recetas en el catálogo marcadas para {MOMENTOS_LABEL[momentoActivo]}. La nutricionista debe crear recetas para este momento.</p>
          </div>
        )}
      </div>
 
      {evaluacion && (
        <div className="bg-white border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-2xl font-medium text-stone-900">Evaluación combinada</h3>
            <div className="flex items-center gap-2">
              {evaluacion.estado === 'aprobado' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {evaluacion.estado === 'observacion' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
              {evaluacion.estado === 'no_aprobado' && <XCircle className="w-5 h-5 text-red-600" />}
              <span className="text-sm font-medium text-stone-700">{evaluacion.cubiertos} de {evaluacion.totalPacientes} pacientes cubiertos</span>
            </div>
          </div>
          
          {evaluacion.estado === 'observacion' && (() => {
            const conUnaOpcion = obtenerPacientesConUnaOpcion(evaluacion);
            return (
              <div className="bg-amber-50 border-l-2 border-amber-600 p-4 mb-4">
                <p className="text-xs uppercase tracking-wider text-amber-900 font-medium mb-2">Pacientes con una sola opción</p>
                <p className="text-xs text-amber-800 mb-3">Estos pacientes solo pueden comer de un camino. Si ese camino falla, quedan sin alternativa.</p>
                {conUnaOpcion.map(p => (
                  <div key={p.id} className="text-sm text-amber-900 mt-1">
                    <span className="font-medium">{p.nombre}</span> <span className="text-amber-700">· Hab. {p.habitacion}</span>
                  </div>
                ))}
              </div>
            );
          })()}
 
          {evaluacion.pacientesNoCubiertos.length > 0 && (
            <div className="bg-red-50 border-l-2 border-red-700 p-4 mb-4">
              <p className="text-xs uppercase tracking-wider text-red-900 font-medium mb-2">Pacientes sin opción válida</p>
              {evaluacion.pacientesNoCubiertos.map(p => (
                <div key={p.id} className="text-sm text-red-900 mt-1">
                  <span className="font-medium">{p.nombre}</span> <span className="text-red-700">· Hab. {p.habitacion}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
 
      {evaluacion && asignaciones && evaluacion.estado !== 'no_aprobado' && (
        <HojaDeServicio asignaciones={asignaciones} caminosSeleccionados={caminosSeleccionados} recetas={recetas} numCaminos={numCaminos} momentoLabel={MOMENTOS_LABEL[momentoActivo]} />
      )}
    </div>
  );
}
 
function CaminoCard({ numero, recetaSeleccionada, recetas, evaluacion, asignaciones, onSelect }) {
  const receta = recetaSeleccionada ? recetas.find(r => r.id === recetaSeleccionada) : null;
  return (
    <div className={`border bg-white transition ${receta ? 'border-stone-300' : 'border-dashed border-stone-300'}`}>
      <div className="p-4 border-b border-stone-200 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-medium">Camino {numero}</p>
        {evaluacion && <span className="text-xs font-medium text-stone-700">{evaluacion.cubiertos.length} pac.</span>}
      </div>
      {!receta ? (
        <div className="p-4">
          <select onChange={(e) => onSelect(parseInt(e.target.value))} value="" className="w-full text-sm border border-stone-200 px-3 py-2 bg-stone-50 focus:outline-none focus:border-stone-900">
            <option value="">Seleccionar receta del catálogo</option>
            {recetas.map(r => (<option key={r.id} value={r.id}>{r.nombre}</option>))}
          </select>
        </div>
      ) : (
        <div className="p-4">
          <h4 className="font-display text-lg font-medium text-stone-900 leading-tight mb-2">{receta.nombre}</h4>
          <span className="text-[10px] uppercase tracking-wider text-stone-500">IDDSI {receta.iddsiMinimo}–{receta.iddsiResultante}</span>
          {asignaciones && asignaciones.length > 0 && (
            <div className="text-xs text-stone-600 border-t border-stone-100 pt-3 mt-3">
              <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Asignados</p>
              <p>{asignaciones.length} pacientes</p>
            </div>
          )}
          <button onClick={() => onSelect(null)} className="mt-3 text-xs text-stone-500 hover:text-stone-900 underline">Cambiar</button>
        </div>
      )}
    </div>
  );
}
 
function HojaDeServicio({ asignaciones, caminosSeleccionados, recetas, numCaminos, momentoLabel }) {
  const cols = numCaminos === 3 ? 'grid-cols-3' : 'grid-cols-2';
  return (
    <div className="bg-stone-900 text-stone-50 p-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-700">
        <ClipboardList className="w-5 h-5" />
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Hoja de servicio · {momentoLabel}</p>
          <h3 className="font-display text-2xl font-medium">Variaciones por paciente</h3>
        </div>
      </div>
      <div className={`grid gap-6 ${cols}`}>
        {Array.from({ length: numCaminos }).map((_, idx) => {
          const recetaId = caminosSeleccionados[idx];
          const receta = recetaId ? recetas.find(r => r.id === recetaId) : null;
          const pacientesAsignados = asignaciones[idx] || [];
          if (!receta) return <div key={idx} />;
          return (
            <div key={idx}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-1">Camino {idx + 1}</p>
              <h4 className="font-display text-lg font-medium mb-4 leading-tight">{receta.nombre}</h4>
              <div className="space-y-3">
                {pacientesAsignados.map((asign, i) => (
                  <div key={i} className="text-sm border-l-2 border-stone-600 pl-3 py-1">
                    <p className="font-medium">{asign.paciente.nombre}</p>
                    <p className="text-xs text-stone-400 mb-1">Hab. {asign.paciente.habitacion}</p>
                    {asign.variaciones.remover.length === 0 && asign.variaciones.noAnadir.length === 0 && !asign.variaciones.triturarA && (
                      <p className="text-xs text-emerald-400">Estándar IDDSI {asign.paciente.iddsi}</p>
                    )}
                    {asign.variaciones.triturarA && <p className="text-xs text-amber-400">→ Triturar a IDDSI {asign.variaciones.triturarA}</p>}
                    {asign.variaciones.remover.map(r => <p key={r} className="text-xs text-amber-400">→ Sin {r}</p>)}
                    {asign.variaciones.noAnadir.map(r => <p key={r} className="text-xs text-amber-400">→ No agregar {r}</p>)}
                  </div>
                ))}
                {pacientesAsignados.length === 0 && <p className="text-xs text-stone-500 italic">Sin pacientes asignados</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// VISTA: CATÁLOGO
// ═══════════════════════════════════════════════════════════════
 
function VistaCatalogo({ recetas, setRecetas, ingredientes, pacientes, soloLectura, editable }) {
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarImportar, setMostrarImportar] = useState(false);
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const [seleccionados, setSeleccionados] = useState([]);
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);
 
  const guardarReceta = (nuevaReceta) => {
    setRecetas(prev => [...prev, { ...nuevaReceta, id: Math.max(...prev.map(r => r.id), 0) + 1 }]);
    setMostrarFormulario(false);
  };
 
  const importarReceta = (nuevaReceta) => {
    setRecetas(prev => [...prev, { ...nuevaReceta, id: Math.max(...prev.map(r => r.id), 0) + 1 }]);
  };
 
  const toggleSeleccion = (id) => {
    setSeleccionados(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
 
  const toggleTodos = () => {
    if (seleccionados.length === recetas.length) setSeleccionados([]);
    else setSeleccionados(recetas.map(r => r.id));
  };
 
  const eliminarSeleccionados = () => {
    setRecetas(prev => prev.filter(r => !seleccionados.includes(r.id)));
    setSeleccionados([]);
    setModoSeleccion(false);
    setConfirmarBorrado(false);
  };
 
  const cancelarSeleccion = () => {
    setModoSeleccion(false);
    setSeleccionados([]);
  };
 
  return (
    <div className="space-y-8">
      <div className="border-b border-stone-200 pb-6 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2">Recetas matriz</p>
          <h2 className="font-display text-4xl font-medium text-stone-900 leading-none">Catálogo</h2>
          <p className="text-sm text-stone-600 mt-2">{recetas.length} recetas validadas · {ingredientes.length} ingredientes</p>
        </div>
        <div className="flex items-center gap-3">
          {soloLectura && (
            <span className="text-[10px] uppercase tracking-wider text-stone-500 bg-stone-100 px-3 py-1.5">Solo lectura</span>
          )}
          {editable && !modoSeleccion && (
            <>
              <button onClick={() => setModoSeleccion(true)} className="px-4 py-2 border border-stone-300 text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50">
                Seleccionar
              </button>
              <button onClick={() => setMostrarImportar(true)} className="px-4 py-2 border border-stone-300 text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50 flex items-center gap-2">
                <Upload className="w-3.5 h-3.5" />Importar CSV
              </button>
              <button onClick={() => setMostrarFormulario(true)} className="px-4 py-2 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider hover:bg-stone-800 flex items-center gap-2">
                <Plus className="w-3.5 h-3.5" />Nueva receta
              </button>
            </>
          )}
          {modoSeleccion && (
            <>
              <button onClick={toggleTodos} className="text-xs text-stone-700 hover:underline">
                {seleccionados.length === recetas.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
              </button>
              <span className="text-xs text-stone-700">{seleccionados.length} seleccionada{seleccionados.length !== 1 ? 's' : ''}</span>
              <button onClick={cancelarSeleccion} className="px-4 py-2 border border-stone-300 text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50">
                Cancelar
              </button>
              <button 
                onClick={() => setConfirmarBorrado(true)} 
                disabled={seleccionados.length === 0}
                className="px-4 py-2 bg-red-700 text-stone-50 text-xs uppercase tracking-wider hover:bg-red-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <X className="w-3.5 h-3.5" />Eliminar {seleccionados.length > 0 && `(${seleccionados.length})`}
              </button>
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {recetas.map(r => {
          const cobertura = pacientes.filter(p => evaluarRecetaParaPaciente(r, p, ingredientes).compatible).length;
          const estaSeleccionada = seleccionados.includes(r.id);
          return (
            <div 
              key={r.id} 
              onClick={() => modoSeleccion ? toggleSeleccion(r.id) : setRecetaSeleccionada(r)} 
              className={`bg-white border p-5 cursor-pointer transition ${
                modoSeleccion 
                  ? estaSeleccionada ? 'border-stone-900 bg-stone-100' : 'border-stone-200 hover:border-stone-400'
                  : 'border-stone-200 hover:border-stone-900'
              }`}
            >
              {modoSeleccion && (
                <div className="mb-3">
                  <input type="checkbox" checked={estaSeleccionada} onChange={() => toggleSeleccion(r.id)} className="cursor-pointer" onClick={e => e.stopPropagation()} />
                </div>
              )}
              <div className="flex items-center justify-between mb-2 gap-2">
                <p className="text-[10px] uppercase tracking-wider text-stone-500 leading-tight">
                  {r.momentosDia.map(m => MOMENTOS_LABEL[m] || m).join(' · ')}
                </p>
                {r.validado && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
              </div>
              <h3 className="font-display text-xl font-medium text-stone-900 leading-tight mb-3">{r.nombre}</h3>
              <div className="flex items-end justify-between pt-3 border-t border-stone-100">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-stone-500">Cobertura</p>
                  <p className="font-display text-2xl font-medium text-stone-900">{cobertura}<span className="text-stone-400 text-base">/{pacientes.length}</span></p>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-stone-500">IDDSI {r.iddsiMinimo}–{r.iddsiResultante}</p>
              </div>
            </div>
          );
        })}
      </div>
      {recetas.length === 0 && (
        <div className="bg-white border border-stone-200 px-6 py-12 text-center">
          <p className="text-sm text-stone-500">No hay recetas en el catálogo</p>
          <p className="text-xs text-stone-400 mt-1">Crea una nueva o importa desde CSV</p>
        </div>
      )}
      {recetaSeleccionada && <RecetaDetalle receta={recetaSeleccionada} ingredientes={ingredientes} pacientes={pacientes} onClose={() => setRecetaSeleccionada(null)} />}
      {mostrarFormulario && <FormularioReceta ingredientes={ingredientes} onSave={guardarReceta} onCancel={() => setMostrarFormulario(false)} />}
      {mostrarImportar && <ModalImportarCSV tipo="receta" ingredientesCatalogo={ingredientes} onSave={importarReceta} onCancel={() => setMostrarImportar(false)} />}
      {confirmarBorrado && (
        <ModalConfirmacion
          titulo="Eliminar recetas"
          mensaje={`¿Confirmas que quieres eliminar ${seleccionados.length} receta${seleccionados.length !== 1 ? 's' : ''}? Esta acción no se puede deshacer.`}
          onConfirmar={eliminarSeleccionados}
          onCancelar={() => setConfirmarBorrado(false)}
        />
      )}
    </div>
  );
}
 
function RecetaDetalle({ receta, ingredientes, pacientes, onClose }) {
  const [tab, setTab] = useState('propiedades');
  return (
    <div className="fixed inset-0 bg-stone-900/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white max-w-3xl w-full flex flex-col" style={{ maxHeight: '92vh' }} onClick={e => e.stopPropagation()}>
        <div className="p-8 border-b border-stone-200 flex-shrink-0">
          <div className="flex items-center justify-between mb-2 gap-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
              {receta.momentosDia.map(m => MOMENTOS_LABEL[m] || m).join(' · ')}
            </p>
            {receta.validado && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider">Validado clínicamente</span>
              </div>
            )}
          </div>
          <h3 className="font-display text-3xl font-medium text-stone-900 leading-tight">{receta.nombre}</h3>
        </div>
        <div className="flex border-b border-stone-200 flex-shrink-0">
          <button onClick={() => setTab('propiedades')} className={`flex-1 px-6 py-4 text-xs uppercase tracking-[0.2em] font-medium transition border-b-2 ${tab === 'propiedades' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-900'}`}>
            <Info className="w-3.5 h-3.5 inline mr-2" />Propiedades
          </button>
          <button onClick={() => setTab('tecnica')} className={`flex-1 px-6 py-4 text-xs uppercase tracking-[0.2em] font-medium transition border-b-2 ${tab === 'tecnica' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-900'}`}>
            <ChefHat className="w-3.5 h-3.5 inline mr-2" />Ficha técnica
          </button>
        </div>
        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          {tab === 'propiedades' && <TabPropiedades receta={receta} ingredientes={ingredientes} pacientes={pacientes} />}
          {tab === 'tecnica' && <TabFichaTecnica receta={receta} ingredientes={ingredientes} />}
        </div>
        <div className="p-4 border-t border-stone-200 flex-shrink-0">
          <button onClick={onClose} className="w-full py-3 bg-stone-900 text-stone-50 text-xs uppercase tracking-[0.2em] hover:bg-stone-800">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
 
function TabPropiedades({ receta, ingredientes, pacientes }) {
  const cobertura = pacientes.filter(p => evaluarRecetaParaPaciente(receta, p, ingredientes).compatible).length;
  return (
    <div className="p-8 space-y-8">
      <div className="bg-stone-50 border border-stone-200 p-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-1">Cobertura en pool actual</p>
            <p className="font-display text-3xl font-medium text-stone-900">{cobertura}<span className="text-stone-400 text-xl">/{pacientes.length}</span><span className="text-sm text-stone-600 ml-2 font-normal" style={{ fontFamily: "'Inter Tight', sans-serif" }}>pacientes</span></p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-1">Tiempo total</p>
            <p className="font-display text-2xl font-medium text-stone-900">{receta.tiempoTotal} min</p>
          </div>
        </div>
      </div>
 
      <Section title="Clasificación clínica">
        <DataRow label="Objetivo clínico" values={receta.objetivosClinicos.map(o => OBJETIVOS_LABEL[o])} />
        <DataRow label="Función nutricional" values={receta.funcionNutricional.map(f => FUNCIONES_LABEL[f])} />
        <DataRow label="Acción cerebral" values={receta.accionCerebral.map(a => ACCION_CEREBRAL_LABEL[a])} />
      </Section>
 
      <Section title="Clasificación gastronómica">
        <DataRow label="Técnicas" values={receta.tecnicas.map(t => TECNICAS_LABEL[t])} />
        <DataRow label="Base de sabor" values={[receta.baseSabor]} capitalize />
        <DataRow label="Temperatura de servicio" values={[receta.temperaturaServicio]} capitalize />
        <DataRow label="Momentos del día" values={receta.momentosDia.map(m => MOMENTOS_LABEL[m] || m)} />
      </Section>
 
      <Section title="Niveles IDDSI">
        <div className="bg-stone-50 border border-stone-100 p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-600">Nivel mínimo alcanzable</span>
            <span className="font-medium text-stone-900">IDDSI {receta.iddsiMinimo} — {IDDSI_DESC[receta.iddsiMinimo]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-600">Nivel base</span>
            <span className="font-medium text-stone-900">IDDSI {receta.iddsiResultante} — {IDDSI_DESC[receta.iddsiResultante]}</span>
          </div>
        </div>
      </Section>
 
      <Section title="Composición por capas">
        <CapaIngredientes label="Capa base · olla principal" color="stone" ingredientes={receta.base} ingredientesDB={ingredientes} />
        {receta.removibles.length > 0 && <CapaIngredientes label="Capa removible · antes de procesar" color="amber" ingredientes={receta.removibles} ingredientesDB={ingredientes} />}
        {receta.anadibles.length > 0 && <CapaIngredientes label="Capa añadible · al servir" color="emerald" ingredientes={receta.anadibles} ingredientesDB={ingredientes} />}
      </Section>
 
      <Section title="Modificaciones aceptadas">
        <div className="flex flex-wrap gap-2">
          {receta.modificacionesAceptadas.map(m => (
            <span key={m} className="text-xs px-3 py-1.5 bg-stone-100 border border-stone-200 text-stone-700">{MODIFICACIONES_LABEL[m] || m}</span>
          ))}
        </div>
      </Section>
 
      {receta.notasCriticas && receta.notasCriticas.length > 0 && (
        <Section title="Notas críticas">
          <div className="space-y-2">
            {receta.notasCriticas.map((n, i) => (
              <div key={i} className="bg-amber-50 border-l-2 border-amber-600 p-3 text-sm text-stone-800">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 inline mr-2" />{n}
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
 
function TabFichaTecnica({ receta, ingredientes }) {
  const [porciones, setPorciones] = useState(receta.porcionesBase);
  const factor = porciones / receta.porcionesBase;
  const ajustarPorciones = (delta) => {
    const v = porciones + delta;
    if (v >= 5 && v <= 60) setPorciones(v);
  };
  const renderIngrediente = (item) => {
    const ing = ingredientes.find(i => i.id === item.id);
    return { nombre: ing ? ing.nombre : '', cantidad: Math.round(item.cantidadG * factor), original: item.cantidadG };
  };
 
  return (
    <div className="p-8 space-y-8">
      <div className="bg-stone-900 text-stone-50 p-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-1">Porciones a preparar</p>
          <p className="font-display text-3xl font-medium">{porciones} pax</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => ajustarPorciones(-5)} disabled={porciones <= 5} className="w-10 h-10 border border-stone-600 hover:bg-stone-800 disabled:opacity-30 flex items-center justify-center">
            <Minus className="w-4 h-4" />
          </button>
          <div className="text-center min-w-[60px]">
            <p className="text-[10px] uppercase tracking-wider text-stone-400">Escala</p>
            <p className="text-sm font-medium">×{factor.toFixed(1)}</p>
          </div>
          <button onClick={() => ajustarPorciones(5)} disabled={porciones >= 60} className="w-10 h-10 border border-stone-600 hover:bg-stone-800 disabled:opacity-30 flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
 
      <Section title="Ingredientes" subtitle={`Cantidades escaladas para ${porciones} porciones`}>
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2">Capa base</p>
          {receta.base.map(item => {
            const d = renderIngrediente(item);
            return (
              <div key={item.id} className="flex items-baseline justify-between border-b border-stone-100 py-2.5">
                <span className="text-sm text-stone-900">{d.nombre}</span>
                <span className="font-display text-lg font-medium text-stone-900">{d.cantidad}<span className="text-stone-500 text-sm ml-1">g</span></span>
              </div>
            );
          })}
        </div>
        {receta.removibles.length > 0 && (
          <div className="space-y-1 mt-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-amber-700 mb-2">Capa removible</p>
            {receta.removibles.map(item => {
              const d = renderIngrediente(item);
              return (
                <div key={item.id} className="flex items-baseline justify-between border-b border-stone-100 py-2.5">
                  <span className="text-sm text-stone-900">{d.nombre}</span>
                  <span className="font-display text-lg font-medium text-stone-900">{d.cantidad}<span className="text-stone-500 text-sm ml-1">g</span></span>
                </div>
              );
            })}
          </div>
        )}
        {receta.anadibles.length > 0 && (
          <div className="space-y-1 mt-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-700 mb-2">Capa añadible · por porción</p>
            {receta.anadibles.map(item => {
              const d = renderIngrediente(item);
              return (
                <div key={item.id} className="flex items-baseline justify-between border-b border-stone-100 py-2.5">
                  <span className="text-sm text-stone-900">{d.nombre}</span>
                  <div className="text-right">
                    <span className="font-display text-lg font-medium text-stone-900">{d.cantidad}<span className="text-stone-500 text-sm ml-1">g</span></span>
                    <p className="text-xs text-stone-500">{d.original}g × {porciones}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>
 
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-stone-200 p-4">
          <div className="flex items-center gap-2 mb-2"><Clock className="w-3.5 h-3.5 text-stone-500" /><p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">Tiempo total</p></div>
          <p className="font-display text-2xl font-medium text-stone-900">{receta.tiempoTotal} min</p>
        </div>
        <div className="border border-stone-200 p-4">
          <div className="flex items-center gap-2 mb-2"><Flame className="w-3.5 h-3.5 text-stone-500" /><p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">Servicio</p></div>
          <p className="font-display text-2xl font-medium text-stone-900 capitalize">{receta.temperaturaServicio}</p>
        </div>
      </div>
 
      <Section title="Proceso de preparación" subtitle="Pasos secuenciales con tiempo y temperatura">
        <div className="space-y-3">
          {receta.proceso.map(paso => (
            <div key={paso.paso} className="border-l-2 border-stone-900 pl-4 py-2">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-display text-2xl font-medium text-stone-900">{paso.paso}</span>
                <p className="text-sm text-stone-900 flex-1"><span className="font-medium">{paso.accion}</span> {paso.ingrediente}</p>
              </div>
              <div className="flex items-center gap-4 ml-9 text-xs text-stone-600">
                {paso.tiempo && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{paso.tiempo} min</span>}
                {paso.temperatura && <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" />{paso.temperatura}°C</span>}
              </div>
              {paso.nota && <p className="text-xs text-stone-600 ml-9 mt-1 italic">{paso.nota}</p>}
            </div>
          ))}
        </div>
      </Section>
 
      <Section title="Textura esperada">
        <div className="bg-stone-50 border border-stone-200 p-4">
          <p className="text-sm text-stone-800">{receta.texturaEsperada}</p>
        </div>
      </Section>
 
      {receta.notasCriticas && receta.notasCriticas.length > 0 && (
        <Section title="Notas críticas">
          <div className="space-y-2">
            {receta.notasCriticas.map((n, i) => (
              <div key={i} className="bg-amber-50 border-l-2 border-amber-600 p-3 text-sm text-stone-800">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 inline mr-2" />{n}
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
 
function Section({ title, subtitle, children }) {
  return (
    <div>
      <div className="mb-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-medium">{title}</p>
        {subtitle && <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
 
function DataRow({ label, values, capitalize = false }) {
  return (
    <div className="flex border-b border-stone-100 py-2.5">
      <span className="text-xs text-stone-500 w-1/3">{label}</span>
      <div className={`text-sm text-stone-900 flex-1 ${capitalize ? 'capitalize' : ''}`}>{values.join(' · ')}</div>
    </div>
  );
}
 
function CapaIngredientes({ label, color, ingredientes, ingredientesDB }) {
  const colorClass = { stone: 'text-stone-500', amber: 'text-amber-700', emerald: 'text-emerald-700' }[color];
  return (
    <div className="mb-4">
      <p className={`text-[10px] uppercase tracking-[0.2em] ${colorClass} mb-2`}>{label}</p>
      <div className="space-y-1">
        {ingredientes.map(item => {
          const ing = ingredientesDB.find(i => i.id === item.id);
          return (
            <div key={item.id} className="flex items-baseline justify-between border-b border-stone-100 py-2">
              <span className="text-sm text-stone-900">{ing ? ing.nombre : ''}</span>
              <span className="text-xs text-stone-500">{item.cantidadG}g base</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
 
function VistaPacientes({ pacientes, setPacientes, soloLectura, editable }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarImportar, setMostrarImportar] = useState(false);
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const [seleccionados, setSeleccionados] = useState([]);
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);
 
  const guardarPaciente = (nuevoPaciente) => {
    setPacientes(prev => [...prev, { ...nuevoPaciente, id: Math.max(...prev.map(p => p.id), 0) + 1 }]);
    setMostrarFormulario(false);
  };
 
  const importarPaciente = (nuevoPaciente) => {
    setPacientes(prev => [...prev, { ...nuevoPaciente, id: Math.max(...prev.map(p => p.id), 0) + 1 }]);
  };
 
  const toggleSeleccion = (id) => {
    setSeleccionados(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
 
  const toggleTodos = () => {
    if (seleccionados.length === pacientes.length) setSeleccionados([]);
    else setSeleccionados(pacientes.map(p => p.id));
  };
 
  const eliminarSeleccionados = () => {
    setPacientes(prev => prev.filter(p => !seleccionados.includes(p.id)));
    setSeleccionados([]);
    setModoSeleccion(false);
    setConfirmarBorrado(false);
  };
 
  const cancelarSeleccion = () => {
    setModoSeleccion(false);
    setSeleccionados([]);
  };
 
  return (
    <div className="space-y-8">
      <div className="border-b border-stone-200 pb-6 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2">Residentes activos</p>
          <h2 className="font-display text-4xl font-medium text-stone-900 leading-none">Pacientes</h2>
          <p className="text-sm text-stone-600 mt-2">{pacientes.length} pacientes con ficha clínica completa</p>
        </div>
        <div className="flex items-center gap-3">
          {soloLectura && (
            <span className="text-[10px] uppercase tracking-wider text-stone-500 bg-stone-100 px-3 py-1.5">Solo lectura</span>
          )}
          {editable && !modoSeleccion && (
            <>
              <button onClick={() => setModoSeleccion(true)} className="px-4 py-2 border border-stone-300 text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50">
                Seleccionar
              </button>
              <button onClick={() => setMostrarImportar(true)} className="px-4 py-2 border border-stone-300 text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50 flex items-center gap-2">
                <Upload className="w-3.5 h-3.5" />Importar CSV
              </button>
              <button onClick={() => setMostrarFormulario(true)} className="px-4 py-2 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider hover:bg-stone-800 flex items-center gap-2">
                <Plus className="w-3.5 h-3.5" />Nuevo paciente
              </button>
            </>
          )}
          {modoSeleccion && (
            <>
              <span className="text-xs text-stone-700">{seleccionados.length} seleccionado{seleccionados.length !== 1 ? 's' : ''}</span>
              <button onClick={cancelarSeleccion} className="px-4 py-2 border border-stone-300 text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50">
                Cancelar
              </button>
              <button 
                onClick={() => setConfirmarBorrado(true)} 
                disabled={seleccionados.length === 0}
                className="px-4 py-2 bg-red-700 text-stone-50 text-xs uppercase tracking-wider hover:bg-red-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <X className="w-3.5 h-3.5" />Eliminar {seleccionados.length > 0 && `(${seleccionados.length})`}
              </button>
            </>
          )}
        </div>
      </div>
      <div className="bg-white border border-stone-200">
        <div className={`grid gap-4 px-6 py-3 border-b border-stone-200 text-[10px] uppercase tracking-wider text-stone-500 font-medium ${modoSeleccion ? 'grid-cols-[40px_repeat(6,1fr)]' : 'grid-cols-6'}`}>
          {modoSeleccion && (
            <div>
              <input type="checkbox" checked={seleccionados.length === pacientes.length && pacientes.length > 0} onChange={toggleTodos} className="cursor-pointer" />
            </div>
          )}
          <div>Nombre</div><div>Hab.</div><div>Edad</div><div>IDDSI</div><div>Condiciones</div><div>Objetivos</div>
        </div>
        {pacientes.map(p => (
          <div 
            key={p.id} 
            onClick={() => modoSeleccion && toggleSeleccion(p.id)}
            className={`grid gap-4 px-6 py-4 border-b border-stone-100 text-sm ${modoSeleccion ? 'grid-cols-[40px_repeat(6,1fr)] cursor-pointer hover:bg-stone-50' : 'grid-cols-6 hover:bg-stone-50'} ${seleccionados.includes(p.id) ? 'bg-stone-100' : ''}`}
          >
            {modoSeleccion && (
              <div>
                <input type="checkbox" checked={seleccionados.includes(p.id)} onChange={() => toggleSeleccion(p.id)} className="cursor-pointer" onClick={e => e.stopPropagation()} />
              </div>
            )}
            <div className="font-medium text-stone-900">{p.nombre}</div>
            <div className="text-stone-600">{p.habitacion}</div>
            <div className="text-stone-600">{p.edad}</div>
            <div className="text-stone-600">{p.iddsi}</div>
            <div className="text-stone-600 text-xs">
              {p.condiciones.length === 0 ? <span className="text-stone-400">—</span> : p.condiciones.map(c => CONDICIONES_LABEL[c]).join(', ')}
              {p.alergias.length > 0 && <span className="text-red-700 ml-1">· {p.alergias.map(a => CONDICIONES_LABEL[a]).join(', ')}</span>}
            </div>
            <div className="text-stone-600 text-xs">{p.objetivos.map(o => OBJETIVOS_LABEL[o]).join(', ')}</div>
          </div>
        ))}
        {pacientes.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-stone-500">No hay pacientes registrados</p>
            <p className="text-xs text-stone-400 mt-1">Crea uno nuevo o importa desde CSV</p>
          </div>
        )}
      </div>
      {mostrarFormulario && <FormularioPaciente onSave={guardarPaciente} onCancel={() => setMostrarFormulario(false)} />}
      {mostrarImportar && <ModalImportarCSV tipo="paciente" ingredientesCatalogo={[]} onSave={importarPaciente} onCancel={() => setMostrarImportar(false)} />}
      {confirmarBorrado && (
        <ModalConfirmacion
          titulo="Eliminar pacientes"
          mensaje={`¿Confirmas que quieres eliminar ${seleccionados.length} paciente${seleccionados.length !== 1 ? 's' : ''}? Esta acción no se puede deshacer.`}
          onConfirmar={eliminarSeleccionados}
          onCancelar={() => setConfirmarBorrado(false)}
        />
      )}
    </div>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// MODAL DE CONFIRMACIÓN
// ═══════════════════════════════════════════════════════════════
 
function ModalConfirmacion({ titulo, mensaje, onConfirmar, onCancelar }) {
  return (
    <div className="fixed inset-0 bg-stone-900/60 z-[60] flex items-center justify-center p-6" onClick={onCancelar}>
      <div className="bg-white max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-700 rounded-sm flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-stone-50" />
          </div>
          <h3 className="font-display text-xl font-medium text-stone-900">{titulo}</h3>
        </div>
        <p className="text-sm text-stone-700 mb-6 leading-relaxed">{mensaje}</p>
        <div className="flex gap-2">
          <button onClick={onCancelar} className="flex-1 py-2.5 border border-stone-300 text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50">
            Cancelar
          </button>
          <button onClick={onConfirmar} className="flex-1 py-2.5 bg-red-700 text-stone-50 text-xs uppercase tracking-wider hover:bg-red-800">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// FORMULARIO PACIENTE - CON CATÁLOGOS VIVOS
// ═══════════════════════════════════════════════════════════════
 
function FormularioPaciente({ onSave, onCancel }) {
  const [nombre, setNombre] = useState('');
  const [habitacion, setHabitacion] = useState('');
  const [edad, setEdad] = useState('');
  const [iddsi, setIddsi] = useState(5);
  const [condiciones, setCondiciones] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [alergias, setAlergias] = useState([]);
  const [objetivos, setObjetivos] = useState([]);
  
  // Catálogos extendidos en vivo
  const [catalogoCondiciones, setCatalogoCondiciones] = useState({ ...CONDICIONES_LABEL });
  const [catalogoMedicamentos, setCatalogoMedicamentos] = useState({ warfarina: 'Warfarina', estatinas: 'Estatinas', metformina: 'Metformina' });
  const [catalogoAlergias, setCatalogoAlergias] = useState({ alergia_pescado: 'Pescado', alergia_lacteos: 'Lácteos', alergia_gluten: 'Gluten', alergia_nuez: 'Nuez' });
  const [catalogoObjetivos, setCatalogoObjetivos] = useState({ ...OBJETIVOS_LABEL });
 
  const [mostrarConsulta, setMostrarConsulta] = useState(null); // { tipo, callback }
 
  const toggle = (arr, setArr, value) => {
    if (arr.includes(value)) setArr(arr.filter(x => x !== value));
    else setArr([...arr, value]);
  };
 
  const handleSubmit = () => {
    if (!nombre || !habitacion || !edad) {
      alert('Completa nombre, habitación y edad');
      return;
    }
    onSave({
      nombre, habitacion, edad: parseInt(edad), iddsi: parseInt(iddsi),
      condiciones, medicamentos, alergias, objetivos
    });
  };
 
  // Callbacks de agregado al catálogo con propagación
  const agregarCondicionAlCatalogo = (key, data) => {
    setCatalogoCondiciones({ ...catalogoCondiciones, [key]: data.nombre });
    setCondiciones([...condiciones, key]);
    
    // Propagación: sugerir medicamentos asociados
    if (data.medicamentos_asociados && data.medicamentos_asociados.length > 0) {
      data.medicamentos_asociados.forEach(medKey => {
        if (CONOCIMIENTO_MEDICAMENTOS[medKey] && !catalogoMedicamentos[medKey]) {
          setCatalogoMedicamentos(prev => ({ ...prev, [medKey]: CONOCIMIENTO_MEDICAMENTOS[medKey].nombre }));
        }
      });
    }
    
    // Propagación: sugerir objetivos asociados
    if (data.objetivos_asociados) {
      data.objetivos_asociados.forEach(objKey => {
        if (CONOCIMIENTO_OBJETIVOS[objKey] && !catalogoObjetivos[objKey]) {
          setCatalogoObjetivos(prev => ({ ...prev, [objKey]: CONOCIMIENTO_OBJETIVOS[objKey].nombre }));
        }
      });
    }
  };
 
  const agregarMedicamentoAlCatalogo = (key, data) => {
    setCatalogoMedicamentos({ ...catalogoMedicamentos, [key]: data.nombre });
    setMedicamentos([...medicamentos, key]);
  };
 
  const agregarAlergiaAlCatalogo = (key, data) => {
    setCatalogoAlergias({ ...catalogoAlergias, [key]: data.nombre });
    setAlergias([...alergias, key]);
  };
 
  const agregarObjetivoAlCatalogo = (key, data) => {
    setCatalogoObjetivos({ ...catalogoObjetivos, [key]: data.nombre });
    setObjetivos([...objetivos, key]);
  };
 
  return (
    <>
      <div className="fixed inset-0 bg-stone-900/40 z-50 flex items-center justify-center p-6" onClick={onCancel}>
        <div className="bg-white max-w-2xl w-full flex flex-col" style={{ maxHeight: '92vh' }} onClick={e => e.stopPropagation()}>
          <div className="p-8 border-b border-stone-200 flex-shrink-0">
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2">Nuevo registro</p>
            <h3 className="font-display text-3xl font-medium text-stone-900">Crear paciente</h3>
          </div>
 
          <div className="flex-1 overflow-y-auto p-8 space-y-8" style={{ minHeight: 0 }}>
            
            <Section title="Datos básicos">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre completo" required>
                  <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full px-3 py-2.5 border border-stone-300 bg-stone-50 text-sm focus:outline-none focus:border-stone-900" placeholder="María González" />
                </Field>
                <Field label="Habitación" required>
                  <input type="text" value={habitacion} onChange={e => setHabitacion(e.target.value)} className="w-full px-3 py-2.5 border border-stone-300 bg-stone-50 text-sm focus:outline-none focus:border-stone-900" placeholder="12" />
                </Field>
                <Field label="Edad" required>
                  <input type="number" value={edad} onChange={e => setEdad(e.target.value)} className="w-full px-3 py-2.5 border border-stone-300 bg-stone-50 text-sm focus:outline-none focus:border-stone-900" placeholder="82" />
                </Field>
                <Field label="Nivel IDDSI requerido">
                  <select value={iddsi} onChange={e => setIddsi(e.target.value)} className="w-full px-3 py-2.5 border border-stone-300 bg-stone-50 text-sm focus:outline-none focus:border-stone-900">
                    {[3, 4, 5, 6, 7].map(n => <option key={n} value={n}>IDDSI {n} — {IDDSI_DESC[n]}</option>)}
                  </select>
                </Field>
              </div>
            </Section>
 
            <SeccionCatalogoVivo
              titulo="Condiciones médicas"
              opciones={catalogoCondiciones}
              seleccionadas={condiciones}
              onToggle={(k) => toggle(condiciones, setCondiciones, k)}
              tipo="condicion"
              onAgregarAlCatalogo={() => setMostrarConsulta({ tipo: 'condicion' })}
            />
 
            <SeccionCatalogoVivo
              titulo="Medicamentos activos"
              opciones={catalogoMedicamentos}
              seleccionadas={medicamentos}
              onToggle={(k) => toggle(medicamentos, setMedicamentos, k)}
              tipo="medicamento"
              onAgregarAlCatalogo={() => setMostrarConsulta({ tipo: 'medicamento' })}
            />
 
            <SeccionCatalogoVivo
              titulo="Alergias"
              opciones={catalogoAlergias}
              seleccionadas={alergias}
              onToggle={(k) => toggle(alergias, setAlergias, k)}
              tipo="alergia"
              variant="alergia"
              onAgregarAlCatalogo={() => setMostrarConsulta({ tipo: 'alergia' })}
            />
 
            <SeccionCatalogoVivo
              titulo="Objetivos clínicos"
              opciones={catalogoObjetivos}
              seleccionadas={objetivos}
              onToggle={(k) => toggle(objetivos, setObjetivos, k)}
              tipo="objetivo"
              onAgregarAlCatalogo={() => setMostrarConsulta({ tipo: 'objetivo' })}
            />
          </div>
 
          <div className="p-4 border-t border-stone-200 flex-shrink-0 flex gap-2">
            <button onClick={onCancel} className="flex-1 py-3 border border-stone-300 text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50">Cancelar</button>
            <button onClick={handleSubmit} className="flex-1 py-3 bg-stone-900 text-stone-50 text-xs uppercase tracking-[0.2em] hover:bg-stone-800">Guardar paciente</button>
          </div>
        </div>
      </div>
 
      {mostrarConsulta && (
        <ConsultaClinica
          tipo={mostrarConsulta.tipo}
          onClose={() => setMostrarConsulta(null)}
          onAgregar={(key, data) => {
            if (mostrarConsulta.tipo === 'condicion') agregarCondicionAlCatalogo(key, data);
            if (mostrarConsulta.tipo === 'medicamento') agregarMedicamentoAlCatalogo(key, data);
            if (mostrarConsulta.tipo === 'alergia') agregarAlergiaAlCatalogo(key, data);
            if (mostrarConsulta.tipo === 'objetivo') agregarObjetivoAlCatalogo(key, data);
            setMostrarConsulta(null);
          }}
        />
      )}
    </>
  );
}
 
function SeccionCatalogoVivo({ titulo, opciones, seleccionadas, onToggle, variant, onAgregarAlCatalogo }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-medium">{titulo}</p>
        <button onClick={onAgregarAlCatalogo} className="text-[10px] uppercase tracking-wider text-stone-700 hover:text-stone-900 flex items-center gap-1 border border-stone-300 px-2 py-1 hover:border-stone-900">
          <Plus className="w-3 h-3" />Agregar al catálogo
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(opciones).map(([key, label]) => (
          <button 
            key={key} 
            onClick={() => onToggle(key)} 
            className={`text-xs px-3 py-1.5 border transition ${
              seleccionadas.includes(key) 
                ? variant === 'alergia' ? 'bg-red-700 text-stone-50 border-red-700' : 'bg-stone-900 text-stone-50 border-stone-900'
                : variant === 'alergia' ? 'bg-white text-stone-700 border-stone-300 hover:border-red-700' : 'bg-white text-stone-700 border-stone-300 hover:border-stone-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// CONSULTA CLÍNICA - simula consulta a APIs reales
// ═══════════════════════════════════════════════════════════════
 
function ConsultaClinica({ tipo, onClose, onAgregar }) {
  const [paso, setPaso] = useState('busqueda'); // busqueda → consultando → resultado
  const [busqueda, setBusqueda] = useState('');
  const [resultado, setResultado] = useState(null);
  const [resultadoKey, setResultadoKey] = useState(null);
 
  const titulos = {
    condicion: 'Agregar condición médica',
    medicamento: 'Agregar medicamento',
    alergia: 'Agregar alergia',
    objetivo: 'Agregar objetivo clínico'
  };
 
  const placeholders = {
    condicion: 'Ej: Parkinson, Alzheimer, EPOC...',
    medicamento: 'Ej: Levodopa, Donepezilo, Furosemida...',
    alergia: 'Ej: Mariscos, Huevo, Soya...',
    objetivo: 'Ej: Sarcopenia, Estreñimiento, Antiinflamatorio...'
  };
 
  const fuentes = {
    condicion: ['NIH', 'Mayo Clinic', 'PubMed'],
    medicamento: ['Drugs.com', 'FDA Label', 'NIH'],
    alergia: ['FARE', 'NIH Allergy'],
    objetivo: ['NIH ODS', 'Dietas validadas (MIND/DASH)', 'PubMed']
  };
 
  const baseConocimiento = {
    condicion: CONOCIMIENTO_CONDICIONES,
    medicamento: CONOCIMIENTO_MEDICAMENTOS,
    alergia: CONOCIMIENTO_ALERGIAS,
    objetivo: CONOCIMIENTO_OBJETIVOS
  }[tipo];
 
  const buscar = () => {
    setPaso('consultando');
    const termino = busqueda.toLowerCase().trim().replace(/ /g, '_').replace(/[áéíóú]/g, m => ({á:'a',é:'e',í:'i',ó:'o',ú:'u'}[m]));
    
    setTimeout(() => {
      // Buscar coincidencia
      const key = Object.keys(baseConocimiento).find(k => 
        k.includes(termino) || termino.includes(k) || 
        baseConocimiento[k].nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
      
      if (key) {
        setResultado(baseConocimiento[key]);
        setResultadoKey(key);
        setPaso('resultado');
      } else {
        setPaso('no_encontrado');
      }
    }, 2200);
  };
 
  return (
    <div className="fixed inset-0 bg-stone-900/60 z-[60] flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white max-w-2xl w-full flex flex-col" style={{ maxHeight: '92vh' }} onClick={e => e.stopPropagation()}>
        
        <div className="p-6 border-b border-stone-200 flex-shrink-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-1">Sistema de conocimiento clínico</p>
          <h3 className="font-display text-2xl font-medium text-stone-900">{titulos[tipo]}</h3>
        </div>
 
        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          
          {paso === 'busqueda' && (
            <div className="p-8">
              <p className="text-sm text-stone-600 mb-4">El sistema consultará fuentes clínicas validadas para extraer toda la información necesaria.</p>
              <div className="mb-4">
                <label className="text-[10px] uppercase tracking-wider text-stone-500 block mb-2">Nombre</label>
                <input 
                  type="text" 
                  value={busqueda} 
                  onChange={e => setBusqueda(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && busqueda && buscar()}
                  className="w-full px-3 py-2.5 border border-stone-300 bg-stone-50 text-sm focus:outline-none focus:border-stone-900" 
                  placeholder={placeholders[tipo]}
                  autoFocus
                />
              </div>
              <div className="bg-stone-50 border border-stone-100 p-4 mb-6">
                <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-2">Fuentes consultadas</p>
                <div className="flex flex-wrap gap-2">
                  {fuentes[tipo].map(f => (
                    <span key={f} className="text-xs px-2 py-1 bg-white border border-stone-200 text-stone-700">{f}</span>
                  ))}
                </div>
              </div>
              <button 
                onClick={buscar} 
                disabled={!busqueda}
                className="w-full py-3 bg-stone-900 text-stone-50 text-xs uppercase tracking-[0.2em] hover:bg-stone-800 disabled:opacity-30 flex items-center justify-center gap-2"
              >
                Consultar fuentes clínicas <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
 
          {paso === 'consultando' && (
            <div className="p-12 text-center">
              <div className="inline-block w-12 h-12 border-2 border-stone-300 border-t-stone-900 rounded-full mb-6" style={{ animation: 'spin 0.8s linear infinite' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p className="font-display text-2xl text-stone-900 mb-4">Consultando fuentes clínicas...</p>
              <div className="space-y-2 max-w-sm mx-auto text-left">
                {fuentes[tipo].map((f, i) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-stone-600" style={{ animation: `fadeIn 0.5s ${i * 0.4}s both` }}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Consultando {f}...
                  </div>
                ))}
              </div>
              <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
            </div>
          )}
 
          {paso === 'resultado' && resultado && (
            <div className="p-8 space-y-6">
              <div className="bg-emerald-50 border-l-2 border-emerald-700 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <p className="text-xs uppercase tracking-wider text-emerald-900 font-medium">Información encontrada y procesada</p>
                </div>
                <p className="text-xs text-emerald-800">El sistema extrajo y estructuró toda la información clínica relevante</p>
              </div>
 
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-1">Categoría</p>
                <p className="text-sm text-stone-700 mb-3">{resultado.categoria}</p>
                <h4 className="font-display text-3xl font-medium text-stone-900 mb-2">{resultado.nombre}</h4>
                <p className="text-sm text-stone-600 leading-relaxed">{resultado.descripcion}</p>
              </div>
 
              {resultado.restricciones && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2">Restricciones absorbidas</p>
                  <div className="space-y-2">
                    {resultado.restricciones.map((r, i) => (
                      <div key={i} className="border border-stone-200 p-3 bg-stone-50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-stone-900">{r.tipo.replace(/_/g, ' ')}</span>
                          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                            r.severidad === 'critica' ? 'bg-red-100 text-red-800' :
                            r.severidad === 'alta' ? 'bg-red-50 text-red-700' :
                            r.severidad === 'moderada' ? 'bg-amber-50 text-amber-700' :
                            'bg-stone-100 text-stone-600'
                          }`}>{r.severidad}</span>
                        </div>
                        <p className="text-xs text-stone-600">{r.motivo}</p>
                        {r.ventana && <p className="text-xs text-stone-500 italic mt-1">Ventana: {r.ventana}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
 
              {resultado.recomendaciones && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-700 mb-2">Recomendaciones absorbidas</p>
                  <div className="space-y-2">
                    {resultado.recomendaciones.map((r, i) => (
                      <div key={i} className="border border-emerald-100 p-3 bg-emerald-50/50">
                        <p className="text-sm font-medium text-stone-900">{r.tipo.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-stone-600">{r.motivo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
 
              {resultado.interacciones_alimentarias && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-amber-700 mb-2">Interacciones alimentarias</p>
                  <div className="space-y-2">
                    {resultado.interacciones_alimentarias.map((r, i) => (
                      <div key={i} className="border border-amber-100 p-3 bg-amber-50/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-stone-900">{r.tipo.replace(/_/g, ' ')}</span>
                          <span className="text-[10px] uppercase tracking-wider text-stone-600">{r.accion}</span>
                        </div>
                        {r.ventana && <p className="text-xs text-stone-500 italic">{r.ventana}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
 
              {resultado.ingredientes_excluidos && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-red-700 mb-2">Ingredientes excluidos</p>
                  <div className="flex flex-wrap gap-1.5">
                    {resultado.ingredientes_excluidos.map(i => (
                      <span key={i} className="text-xs px-2 py-1 bg-red-50 text-red-800 border border-red-100">{i}</span>
                    ))}
                  </div>
                  {resultado.sustitutos_seguros && (
                    <>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-700 mt-3 mb-2">Sustitutos seguros sugeridos</p>
                      <div className="flex flex-wrap gap-1.5">
                        {resultado.sustitutos_seguros.map(i => (
                          <span key={i} className="text-xs px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-100">{i}</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
 
              {resultado.ingredientes_prioritarios && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-700 mb-2">Ingredientes prioritarios</p>
                  <div className="flex flex-wrap gap-1.5">
                    {resultado.ingredientes_prioritarios.map(i => (
                      <span key={i} className="text-xs px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-100">{i}</span>
                    ))}
                  </div>
                </div>
              )}
 
              {(resultado.medicamentos_asociados || resultado.objetivos_asociados) && (
                <div className="bg-stone-50 border border-stone-200 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2">Propagación automática</p>
                  <p className="text-xs text-stone-600 mb-2">Al agregar esta condición, el sistema sugerirá automáticamente:</p>
                  {resultado.medicamentos_asociados && resultado.medicamentos_asociados.length > 0 && (
                    <div className="mb-2">
                      <span className="text-[10px] uppercase tracking-wider text-stone-500">Medicamentos: </span>
                      {resultado.medicamentos_asociados.map(m => (
                        <span key={m} className="text-xs text-stone-700 mr-2 capitalize">{m}</span>
                      ))}
                    </div>
                  )}
                  {resultado.objetivos_asociados && (
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-500">Objetivos: </span>
                      {resultado.objetivos_asociados.map(o => (
                        <span key={o} className="text-xs text-stone-700 mr-2 capitalize">{o.replace(/_/g, ' ')}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
 
              <div className="border-t border-stone-200 pt-4">
                <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Fuente clínica</p>
                <p className="text-xs text-stone-700 italic">{resultado.fuente}</p>
              </div>
            </div>
          )}
 
          {paso === 'no_encontrado' && (
            <div className="p-12 text-center">
              <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto mb-4" />
              <p className="font-display text-xl text-stone-900 mb-2">No se encontró información</p>
              <p className="text-sm text-stone-600 mb-6">El término no está disponible en las fuentes clínicas consultadas. En producción, podrías cargar un documento PDF o ingresar la información manualmente.</p>
              <p className="text-xs text-stone-500 italic">Demo: prueba con Parkinson, Alzheimer, EPOC, Levodopa, Donepezilo, Furosemida, Mariscos, Huevo, Sarcopenia, Estreñimiento</p>
            </div>
          )}
        </div>
 
        <div className="p-4 border-t border-stone-200 flex-shrink-0 flex gap-2">
          {paso === 'resultado' ? (
            <>
              <button onClick={onClose} className="flex-1 py-3 border border-stone-300 text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50">Cancelar</button>
              <button onClick={() => onAgregar(resultadoKey, resultado)} className="flex-1 py-3 bg-stone-900 text-stone-50 text-xs uppercase tracking-[0.2em] hover:bg-stone-800">Integrar al catálogo</button>
            </>
          ) : paso === 'no_encontrado' ? (
            <>
              <button onClick={onClose} className="flex-1 py-3 border border-stone-300 text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50">Cerrar</button>
              <button onClick={() => { setBusqueda(''); setPaso('busqueda'); }} className="flex-1 py-3 bg-stone-900 text-stone-50 text-xs uppercase tracking-[0.2em] hover:bg-stone-800">Buscar otro</button>
            </>
          ) : (
            <button onClick={onClose} className="w-full py-3 border border-stone-300 text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50">Cancelar</button>
          )}
        </div>
      </div>
    </div>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// FORMULARIO RECETA
// ═══════════════════════════════════════════════════════════════
 
function FormularioReceta({ ingredientes, onSave, onCancel }) {
  const [nombre, setNombre] = useState('');
  const [momentosDia, setMomentosDia] = useState(['almuerzo']);
  const [temperaturaServicio, setTemperaturaServicio] = useState('caliente');
  const [baseSabor, setBaseSabor] = useState('salado');
  const [iddsiResultante, setIddsiResultante] = useState(5);
  const [iddsiMinimo, setIddsiMinimo] = useState(4);
  const [tiempoTotal, setTiempoTotal] = useState(30);
  const [base, setBase] = useState([]);
  const [removibles, setRemovibles] = useState([]);
  const [anadibles, setAnadibles] = useState([]);
  const [objetivosClinicos, setObjetivosClinicos] = useState([]);
  const [tecnicas, setTecnicas] = useState([]);
  const [texturaEsperada, setTexturaEsperada] = useState('');
  const [proceso, setProceso] = useState([{ paso: 1, accion: '', ingrediente: '', tiempo: null, temperatura: null, nota: '' }]);
 
  const toggle = (arr, setArr, value) => {
    if (arr.includes(value)) setArr(arr.filter(x => x !== value));
    else setArr([...arr, value]);
  };
 
  const agregarIngrediente = (capa, setCapa, id) => {
    if (capa.find(item => item.id === id)) return;
    setCapa([...capa, { id, cantidadG: 50 }]);
  };
 
  const actualizarCantidad = (capa, setCapa, id, cantidadG) => {
    setCapa(capa.map(item => item.id === id ? { ...item, cantidadG: parseInt(cantidadG) || 0 } : item));
  };
 
  const removerIngrediente = (capa, setCapa, id) => {
    setCapa(capa.filter(item => item.id !== id));
  };
 
  const agregarPaso = () => {
    setProceso([...proceso, { paso: proceso.length + 1, accion: '', ingrediente: '', tiempo: null, temperatura: null, nota: '' }]);
  };
 
  const actualizarPaso = (idx, campo, valor) => {
    const nuevo = [...proceso];
    nuevo[idx] = { ...nuevo[idx], [campo]: valor };
    setProceso(nuevo);
  };
 
  const eliminarPaso = (idx) => {
    setProceso(proceso.filter((_, i) => i !== idx).map((p, i) => ({ ...p, paso: i + 1 })));
  };
 
  const handleSubmit = () => {
    if (!nombre || base.length === 0 || momentosDia.length === 0) {
      alert('Completa nombre, al menos un momento del día y al menos un ingrediente base');
      return;
    }
    onSave({
      nombre, momentosDia, temperaturaServicio, baseSabor,
      iddsiResultante: parseInt(iddsiResultante), iddsiMinimo: parseInt(iddsiMinimo),
      tiempoTotal: parseInt(tiempoTotal), porcionesBase: 5, validado: true,
      base, removibles, anadibles,
      objetivosClinicos, tecnicas,
      funcionNutricional: [], accionCerebral: [],
      modificacionesAceptadas: [],
      proceso, texturaEsperada,
      notasCriticas: []
    });
  };
 
  return (
    <div className="fixed inset-0 bg-stone-900/40 z-50 flex items-center justify-center p-6" onClick={onCancel}>
      <div className="bg-white max-w-3xl w-full flex flex-col" style={{ maxHeight: '92vh' }} onClick={e => e.stopPropagation()}>
        <div className="p-8 border-b border-stone-200 flex-shrink-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2">Nueva receta matriz</p>
          <h3 className="font-display text-3xl font-medium text-stone-900">Crear receta</h3>
        </div>
 
        <div className="flex-1 overflow-y-auto p-8 space-y-8" style={{ minHeight: 0 }}>
          
          <Section title="Datos básicos">
            <Field label="Nombre de la receta" required>
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full px-3 py-2.5 border border-stone-300 bg-stone-50 text-sm focus:outline-none focus:border-stone-900" placeholder="Puré de salmón con calabaza" />
            </Field>
            
            <div className="mt-3">
              <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-2">
                Momentos del día <span className="text-red-700">*</span>
                <span className="text-stone-400 normal-case ml-2 tracking-normal">Selecciona uno o varios</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(MOMENTOS_LABEL).map(([key, label]) => (
                  <button key={key} onClick={() => toggle(momentosDia, setMomentosDia, key)} className={`text-xs px-3 py-1.5 border transition ${momentosDia.includes(key) ? 'bg-stone-900 text-stone-50 border-stone-900' : 'bg-white text-stone-700 border-stone-300 hover:border-stone-900'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
 
            <div className="grid grid-cols-2 gap-4 mt-3">
              <Field label="Base de sabor">
                <select value={baseSabor} onChange={e => setBaseSabor(e.target.value)} className="w-full px-3 py-2.5 border border-stone-300 bg-stone-50 text-sm">
                  <option value="salado">Salado</option>
                  <option value="dulce">Dulce</option>
                  <option value="neutro">Neutro</option>
                  <option value="acido">Ácido</option>
                  <option value="umami">Umami</option>
                </select>
              </Field>
              <Field label="Temperatura de servicio">
                <select value={temperaturaServicio} onChange={e => setTemperaturaServicio(e.target.value)} className="w-full px-3 py-2.5 border border-stone-300 bg-stone-50 text-sm">
                  <option value="caliente">Caliente</option>
                  <option value="tibio">Tibio</option>
                  <option value="ambiente">Ambiente</option>
                  <option value="frio">Frío</option>
                </select>
              </Field>
              <Field label="Tiempo total (min)">
                <input type="number" value={tiempoTotal} onChange={e => setTiempoTotal(e.target.value)} className="w-full px-3 py-2.5 border border-stone-300 bg-stone-50 text-sm" />
              </Field>
              <Field label="IDDSI base">
                <select value={iddsiResultante} onChange={e => setIddsiResultante(e.target.value)} className="w-full px-3 py-2.5 border border-stone-300 bg-stone-50 text-sm">
                  {[3, 4, 5, 6].map(n => <option key={n} value={n}>IDDSI {n} — {IDDSI_DESC[n]}</option>)}
                </select>
              </Field>
              <Field label="IDDSI mínimo alcanzable">
                <select value={iddsiMinimo} onChange={e => setIddsiMinimo(e.target.value)} className="w-full px-3 py-2.5 border border-stone-300 bg-stone-50 text-sm">
                  {[3, 4, 5, 6].map(n => <option key={n} value={n}>IDDSI {n} — {IDDSI_DESC[n]}</option>)}
                </select>
              </Field>
            </div>
          </Section>
 
          <CapaSelector label="Capa base · olla principal" color="stone" capa={base} setCapa={setBase} ingredientes={ingredientes} agregarIngrediente={agregarIngrediente} actualizarCantidad={actualizarCantidad} removerIngrediente={removerIngrediente} />
 
          <CapaSelector label="Capa removible · antes de procesar" color="amber" capa={removibles} setCapa={setRemovibles} ingredientes={ingredientes} agregarIngrediente={agregarIngrediente} actualizarCantidad={actualizarCantidad} removerIngrediente={removerIngrediente} />
 
          <CapaSelector label="Capa añadible · al servir" color="emerald" capa={anadibles} setCapa={setAnadibles} ingredientes={ingredientes} agregarIngrediente={agregarIngrediente} actualizarCantidad={actualizarCantidad} removerIngrediente={removerIngrediente} />
 
          <Section title="Objetivos clínicos">
            <div className="flex flex-wrap gap-2">
              {Object.entries(OBJETIVOS_LABEL).map(([key, label]) => (
                <button key={key} onClick={() => toggle(objetivosClinicos, setObjetivosClinicos, key)} className={`text-xs px-3 py-1.5 border transition ${objetivosClinicos.includes(key) ? 'bg-stone-900 text-stone-50 border-stone-900' : 'bg-white text-stone-700 border-stone-300 hover:border-stone-900'}`}>
                  {label}
                </button>
              ))}
            </div>
          </Section>
 
          <Section title="Técnicas utilizadas">
            <div className="flex flex-wrap gap-2">
              {Object.entries(TECNICAS_LABEL).map(([key, label]) => (
                <button key={key} onClick={() => toggle(tecnicas, setTecnicas, key)} className={`text-xs px-3 py-1.5 border transition ${tecnicas.includes(key) ? 'bg-stone-900 text-stone-50 border-stone-900' : 'bg-white text-stone-700 border-stone-300 hover:border-stone-900'}`}>
                  {label}
                </button>
              ))}
            </div>
          </Section>
 
          <Section title="Textura esperada">
            <textarea value={texturaEsperada} onChange={e => setTexturaEsperada(e.target.value)} className="w-full px-3 py-2.5 border border-stone-300 bg-stone-50 text-sm focus:outline-none focus:border-stone-900" rows={2} placeholder="Lisa, color uniforme, cae lento de la cuchara" />
          </Section>
 
          <Section title="Proceso de preparación">
            <div className="space-y-3">
              {proceso.map((paso, idx) => (
                <div key={idx} className="border border-stone-200 p-3 bg-stone-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-lg font-medium text-stone-900">Paso {paso.paso}</span>
                    {proceso.length > 1 && (
                      <button onClick={() => eliminarPaso(idx)} className="text-xs text-red-700 hover:underline">Eliminar</button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input type="text" placeholder="Acción (escalfar, licuar...)" value={paso.accion} onChange={e => actualizarPaso(idx, 'accion', e.target.value)} className="px-2 py-1.5 border border-stone-300 bg-white text-xs" />
                    <input type="text" placeholder="Ingrediente" value={paso.ingrediente} onChange={e => actualizarPaso(idx, 'ingrediente', e.target.value)} className="px-2 py-1.5 border border-stone-300 bg-white text-xs" />
                    <input type="number" placeholder="Tiempo (min)" value={paso.tiempo || ''} onChange={e => actualizarPaso(idx, 'tiempo', parseInt(e.target.value) || null)} className="px-2 py-1.5 border border-stone-300 bg-white text-xs" />
                    <input type="number" placeholder="Temperatura (°C)" value={paso.temperatura || ''} onChange={e => actualizarPaso(idx, 'temperatura', parseInt(e.target.value) || null)} className="px-2 py-1.5 border border-stone-300 bg-white text-xs" />
                  </div>
                  <input type="text" placeholder="Nota (opcional)" value={paso.nota} onChange={e => actualizarPaso(idx, 'nota', e.target.value)} className="w-full px-2 py-1.5 border border-stone-300 bg-white text-xs" />
                </div>
              ))}
              <button onClick={agregarPaso} className="w-full py-2 border border-dashed border-stone-300 text-xs text-stone-600 hover:bg-stone-50 flex items-center justify-center gap-2">
                <Plus className="w-3 h-3" />Agregar paso
              </button>
            </div>
          </Section>
        </div>
 
        <div className="p-4 border-t border-stone-200 flex-shrink-0 flex gap-2">
          <button onClick={onCancel} className="flex-1 py-3 border border-stone-300 text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50">Cancelar</button>
          <button onClick={handleSubmit} className="flex-1 py-3 bg-stone-900 text-stone-50 text-xs uppercase tracking-[0.2em] hover:bg-stone-800">Guardar receta</button>
        </div>
      </div>
    </div>
  );
}
 
// Sub-componentes de los formularios
 
function Field({ label, required, children }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1.5">
        {label}{required && <span className="text-red-700 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
 
function CapaSelector({ label, color, capa, ingredientes, agregarIngrediente, actualizarCantidad, removerIngrediente, setCapa }) {
  const colorClass = { stone: 'text-stone-500', amber: 'text-amber-700', emerald: 'text-emerald-700' }[color];
  const ingredientesDisponibles = ingredientes.filter(i => !capa.find(c => c.id === i.id));
 
  return (
    <div>
      <p className={`text-[10px] uppercase tracking-[0.2em] ${colorClass} mb-3 font-medium`}>{label}</p>
      <div className="space-y-1 mb-3">
        {capa.map(item => {
          const ing = ingredientes.find(i => i.id === item.id);
          return (
            <div key={item.id} className="flex items-center gap-2 border-b border-stone-100 py-2">
              <span className="text-sm text-stone-900 flex-1">{ing ? ing.nombre : ''}</span>
              <input type="number" value={item.cantidadG} onChange={e => actualizarCantidad(capa, setCapa, item.id, e.target.value)} className="w-20 px-2 py-1 border border-stone-300 bg-white text-sm text-right" />
              <span className="text-xs text-stone-500">g</span>
              <button onClick={() => removerIngrediente(capa, setCapa, item.id)} className="text-xs text-red-700 hover:underline ml-2">×</button>
            </div>
          );
        })}
        {capa.length === 0 && <p className="text-xs text-stone-400 italic py-2">Sin ingredientes en esta capa</p>}
      </div>
      {ingredientesDisponibles.length > 0 && (
        <select onChange={e => { if (e.target.value) { agregarIngrediente(capa, setCapa, parseInt(e.target.value)); e.target.value = ''; } }} value="" className="w-full px-3 py-2 border border-dashed border-stone-300 bg-white text-xs text-stone-600">
          <option value="">+ Agregar ingrediente</option>
          {ingredientesDisponibles.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}
        </select>
      )}
    </div>
  );
}
 
