'use strict';

const BOT_TOKEN = String(process.env.ID_BOT_TOKEN || '').trim();
const POLL_TIMEOUT_SECONDS = 25;
const RETRY_DELAY_MS = 1500;

const registeredTopics = new Map();

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function getThreadId(message) {
    const value = Number(
        message?.message_thread_id ||
        message?.forum_topic_created?.message_thread_id ||
        0
    );
    return Number.isInteger(value) && value > 0 ? value : null;
}

function getTopicName(message) {
    return String(message?.forum_topic_created?.name || '').trim();
}

async function telegram(method, payload) {
    const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/${method}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload || {})
        }
    );
    const data = await response.json();
    if (!data.ok) {
        throw new Error(data.description || 'Telegram API error');
    }
    return data.result;
}

async function sendMessage(chatId, text, threadId = null) {
    const payload = {
        chat_id: chatId,
        text,
        parse_mode: 'HTML'
    };
    if (threadId) {
        payload.message_thread_id = threadId;
    }
    await telegram('sendMessage', payload);
}

function helpText() {
    return [
        '<b>FREEzzzGames ID Helper</b>',
        '',
        '/id — ID группы и текущей темы',
        '/register — зарегистрировать текущую тему',
        '/rooms — показать зарегистрированные темы',
        '/setup — инструкция'
    ].join('\n');
}

async function handleMessage(message) {
    if (!message?.text || !message?.chat?.id) return;

    const raw = String(message.text).trim();
    if (!raw.startsWith('/')) return;

    const command = raw.split(/\s+/)[0].split('@')[0].toLowerCase();
    const chatId = String(message.chat.id);
    const threadId = getThreadId(message);
    const topicName = getTopicName(message);

    if (command === '/start' || command === '/help') {
        await sendMessage(message.chat.id, helpText(), threadId);
        return;
    }

    if (command === '/id' || command === '/setup') {
        const text = [
            '<b>FREEzzzGames ID Helper</b>',
            '',
            `📦 Chat ID: <code>${escapeHtml(chatId)}</code>`,
            `🧵 Thread ID: <code>${escapeHtml(threadId || '—')}</code>`,
            `🏷 Topic: <code>${escapeHtml(topicName || 'текущий топик')}</code>`,
            '',
            threadId
                ? 'Используй /register в этом топике.'
                : 'Открой Telegram Topic и отправь /register.'
        ].join('\n');

        await sendMessage(message.chat.id, text, threadId);
        return;
    }

    if (command === '/register') {
        if (!threadId) {
            await sendMessage(
                message.chat.id,
                '⚠️ /register нужно отправлять внутри Telegram Topic.'
            );
            return;
        }

        registeredTopics.set(`${chatId}:${threadId}`, {
            chatId,
            threadId,
            topicName: topicName || 'Без названия'
        });

        const text = [
            '✅ <b>Тема зарегистрирована</b>',
            '',
            `📦 Chat ID: <code>${escapeHtml(chatId)}</code>`,
            `🧵 Thread ID: <code>${escapeHtml(threadId)}</code>`,
            `🏷 Topic: <code>${escapeHtml(topicName || 'Без названия')}</code>`
        ].join('\n');

        await sendMessage(message.chat.id, text, threadId);
        return;
    }

    if (command === '/rooms') {
        const topics = Array.from(registeredTopics.values())
            .filter(item => item.chatId === chatId)
            .sort((a, b) => a.threadId - b.threadId);

        if (!topics.length) {
            await sendMessage(
                message.chat.id,
                'Пока нет зарегистрированных тем. Открой каждую тему и отправь /register.',
                threadId
            );
            return;
        }

        const lines = topics.map(item =>
            `🧵 <b>${escapeHtml(item.topicName)}</b> — <code>${escapeHtml(item.threadId)}</code>`
        );

        await sendMessage(
            message.chat.id,
            [
                '<b>FREEzzzGames Topics</b>',
                '',
                `📦 Chat ID: <code>${escapeHtml(chatId)}</code>`,
                ...lines
            ].join('\n'),
            threadId
        );
    }
}

async function poll() {
    let offset = 0;

    while (true) {
        try {
            const updates = await telegram('getUpdates', {
                offset,
                timeout: POLL_TIMEOUT_SECONDS,
                allowed_updates: ['message']
            });

            for (const update of updates) {
                offset = Number(update.update_id) + 1;
                try {
                    await handleMessage(update.message);
                } catch (error) {
                    console.error('ID bot update error:', error.message);
                }
            }
        } catch (error) {
            console.error('ID bot polling error:', error.message);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        }
    }
}

function startIdBot() {
    if (!BOT_TOKEN) {
        console.log('Telegram ID bot disabled: ID_BOT_TOKEN is not set.');
        return;
    }

    console.log('FREEzzzGames Telegram ID bot starting...');
    poll().catch(error => {
        console.error('Telegram ID bot stopped:', error);
    });
}

module.exports = { startIdBot };
