FROM node:24-alpine AS base
WORKDIR /app

FROM base AS deps

# Install libc6-compat for some native deps
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .


ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build