#FROM node:20-alpine AS base
#
#ARG JWT_SECRET
#ARG JWT_EXPIRES_IN
#ARG ADMIN_EMAIL
#ARG ADMIN_PASSWORD
#ARG DATABASE_URL
#
#ENV JWT_SECRET=${JWT_SECRET}
#ENV JWT_EXPIRES_IN=${JWT_EXPIRES_IN}
#ENV ADMIN_EMAIL=${ADMIN_EMAIL}
#ENV ADMIN_PASSWORD=${ADMIN_PASSWORD}
#ENV DATABASE_URL=${DATABASE_URL}
#
#FROM base AS deps
#
#COPY package.json package-lock.json* ./
#
#RUN npm ci
#
#FROM base AS builder
#COPY --from=deps /node_modules ./node_modules
#COPY . .
#
#ENV NODE_ENV production
#ENV NEXT_TELEMETRY_DISABLED 1
#
#RUN npx prisma generate
#
#RUN npm run build
#
#FROM base AS runner
#
#ENV NODE_ENV production
#ENV NEXT_TELEMETRY_DISABLED 1
#
#RUN addgroup --system --gid 1001 nodejs && \
#    adduser --system --uid 1001 nextjs
#
#COPY --from=builder /public ./public
#
#RUN mkdir .next
#RUN chown nextjs:nodejs .next
#
#COPY --from=builder --chown=nextjs:nodejs /.next ./.next
#COPY --from=builder /node_modules/.prisma ./node_modules/.prisma
#
#USER nextjs
#
#EXPOSE 3000
#
#ENV PORT 3000
#ENV HOSTNAME "0.0.0.0"
#
#CMD ["npm", "start"]

# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS base
ARG JWT_SECRET
ARG JWT_EXPIRES_IN
ARG ADMIN_EMAIL
ARG ADMIN_PASSWORD
ARG DATABASE_URL

ENV JWT_SECRET=${JWT_SECRET}
ENV JWT_EXPIRES_IN=${JWT_EXPIRES_IN}
ENV ADMIN_EMAIL=${ADMIN_EMAIL}
ENV ADMIN_PASSWORD=${ADMIN_PASSWORD}
ENV DATABASE_URL=${DATABASE_URL}

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN npm ci

FROM base AS builder
ARG JWT_SECRET
ARG JWT_EXPIRES_IN
ARG ADMIN_EMAIL
ARG ADMIN_PASSWORD
ARG DATABASE_URL

ENV JWT_SECRET=${JWT_SECRET}
ENV JWT_EXPIRES_IN=${JWT_EXPIRES_IN}
ENV ADMIN_EMAIL=${ADMIN_EMAIL}
ENV ADMIN_PASSWORD=${ADMIN_PASSWORD}
ENV DATABASE_URL=${DATABASE_URL}

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npx prisma generate

RUN npm run build

FROM base AS runner
ARG JWT_SECRET
ARG JWT_EXPIRES_IN
ARG ADMIN_EMAIL
ARG ADMIN_PASSWORD
ARG DATABASE_URL

ENV JWT_SECRET=${JWT_SECRET}
ENV JWT_EXPIRES_IN=${JWT_EXPIRES_IN}
ENV ADMIN_EMAIL=${ADMIN_EMAIL}
ENV ADMIN_PASSWORD=${ADMIN_PASSWORD}
ENV DATABASE_URL=${DATABASE_URL}

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]