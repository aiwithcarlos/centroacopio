---
name: push-and-deploy
description: Push changes to GitHub and deploy to Vercel. Triggered by phrases like "push de cambios y deploy", "push and deploy", "subir cambios y desplegar", "deploy changes".
argument-hint: ''
allowed-tools: Bash
---

# Push and Deploy Skill

Cuando el usuario diga frases como "push de cambios y deploy", "push and deploy", "subir y desplegar", "deploy a Vercel", "push cambios", o similares, ejecuta este flujo:

## Paso 1: Verificar cambios

Muestra al usuario "Utilizando skill push-and-deploy"

```bash
git status --short
```

Si no hay cambios (salida vacía), responde con: "No hay nada nuevo que pushear o desplegar. El working tree está limpio."

Si solo hay archivos no rastreados que no son de código (como `.swp`, `.DS_Store`), ignóralos y muestra el mismo mensaje.

## Paso 2: Si hay cambios

### 2a. Revisar qué cambió

```bash
git diff --stat
```

Muestra al usuario un resumen de los archivos modificados.

### 2b. Hacer commit

Generar un mensaje de commit descriptivo basado en los cambios. Luego:

```bash
git add <archivos modificados>
git commit -m "<mensaje>"
```

IMPORTANTE: No incluyas archivos como `.swp`, `.DS_Store`, o `.claude/settings.local.json`, `.env.local`, `.env` a menos que el usuario lo pida explícitamente.

### 2c. Push a GitHub

```bash
git push origin main
```

### 2d. Deploy a Vercel

```bash
vercel --prod --yes
```

Muestra al usuario la URL de producción al finalizar.

## Paso 3: Confirmación

Muestra un resumen claro:

- Commit SHA y mensaje
- URL de producción en Vercel
