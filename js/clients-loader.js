/* ============================================
   HEXI AGENCY - DYNAMIC LOADER
   js/clients-loader.js

   Fetches clients.json AND team.json from server
   Populates clients marquee, clients grid, AND team grid
   Supports dark/light theme swapping
   ============================================ */

(function () {
    'use strict';

    var CONFIG = {
        /* Change to your server URL after deploy */
        clientsUrl: 'http://localhost:3000/clients.json',
        teamUrl: 'http://localhost:3000/team.json',
        marqueeDuplicates: 2
    };

    document.addEventListener('DOMContentLoaded', function () {
        loadClients();
        loadTeam();
    });

    /* ============================================
       LOAD CLIENTS
       ============================================ */
    async function loadClients() {
        var data = null;

        try {
            var response = await fetch(CONFIG.clientsUrl);
            if (response.ok) {
                data = await response.json();
                console.log('✅ Clients loaded: ' + data.count);
            }
        } catch (error) {
            console.log('⚠️ Clients fetch failed, using static HTML');
            return;
        }

        if (data && data.clients && data.clients.length > 0) {
            renderMarquee(data.clients);
            renderClientsGrid(data.clients);
            updateTrustCount(data.clients.length);
            applyTheme();
        }
    }

    /* ============================================
       LOAD TEAM
       ============================================ */
    async function loadTeam() {
        var data = null;

        try {
            var response = await fetch(CONFIG.teamUrl);
            if (response.ok) {
                data = await response.json();
                console.log('✅ Team loaded: ' + data.count);
            }
        } catch (error) {
            console.log('⚠️ Team fetch failed, using static HTML');
            return;
        }

        if (data && data.team && data.team.length > 0) {
            renderTeamGrid(data.team);
        }
    }

    /* ============================================
       APPLY CURRENT THEME TO NEW IMAGES
       ============================================ */
    function applyTheme() {
        var currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        if (window.swapThemeImages) {
            window.swapThemeImages(currentTheme);
        }
    }

    /* ============================================
       RENDER MARQUEE (Home Page)
       ============================================ */
    function renderMarquee(clients) {
        var track = document.querySelector('#page-home .clients-track');
        if (!track) return;

        var html = '';
        for (var d = 0; d < CONFIG.marqueeDuplicates; d++) {
            clients.forEach(function (client) {
                html += buildMarqueeItem(client);
            });
        }
        track.innerHTML = html;
    }

    function buildMarqueeItem(client) {
        var imgTag = '';
        if (client.hasWhiteVersion && client.logoWhite) {
            imgTag = '<img src="' + client.logoWhite + '" alt="' + esc(client.name) + '" loading="lazy" class="theme-client" data-dark="' + client.logoWhite + '" data-light="' + client.logo + '">';
        } else {
            imgTag = '<img src="' + client.logo + '" alt="' + esc(client.name) + '" loading="lazy">';
        }
        return '<div class="client-logo-item"><div class="client-logo-inner">' + imgTag + '</div></div>';
    }

    /* ============================================
       RENDER CLIENTS GRID (Clients Page)
       ============================================ */
    function renderClientsGrid(clients) {
        var grid = document.querySelector('#page-clients .clients-full-grid');
        if (!grid) return;

        var html = '';
        var delays = [0, 50, 100, 150];
        clients.forEach(function (client, index) {
            var delay = delays[index % delays.length];
            html += buildGridItem(client, delay);
        });
        grid.innerHTML = html;
    }

    function buildGridItem(client, delay) {
        var imgTag = '';
        if (client.hasWhiteVersion && client.logoWhite) {
            imgTag = '<img src="' + client.logoWhite + '" alt="' + esc(client.name) + '" loading="lazy" class="theme-client" data-dark="' + client.logoWhite + '" data-light="' + client.logo + '">';
        } else {
            imgTag = '<img src="' + client.logo + '" alt="' + esc(client.name) + '" loading="lazy">';
        }
        return '<div class="client-card glass-card reveal-up" data-delay="' + delay + '">' +
            '<div class="client-card-inner">' +
            '<div class="client-logo-placeholder">' + imgTag + '</div>' +
            '<h3 class="client-name">' + esc(client.name) + '</h3>' +
            '</div></div>';
    }

    /* ============================================
       RENDER TEAM GRID (Team Page)
       ============================================ */
    function renderTeamGrid(team) {
        var grid = document.querySelector('#page-team .team-grid');
        if (!grid) return;

        var html = '';
        var delays = [0, 100, 200];

        team.forEach(function (member, index) {
            var delay = delays[index % delays.length];
            html += buildTeamCard(member, delay);
        });

        grid.innerHTML = html;
    }

    function buildTeamCard(member, delay) {
        var tagsHtml = '';
        if (member.tags && member.tags.length > 0) {
            member.tags.forEach(function (tag) {
                tagsHtml += '<span class="team-expertise-tag">' + esc(tag) + '</span>';
            });
        }

        return '<div class="team-card reveal-up" data-delay="' + delay + '">' +
            '<div class="team-card-inner">' +
                '<div class="team-avatar">' +
                    '<div class="team-avatar-glow"></div>' +
                    '<div class="team-avatar-inner">' +
                        '<img src="' + member.photo + '" alt="' + esc(member.name) + '" loading="lazy">' +
                    '</div>' +
                    '<div class="team-avatar-ring"></div>' +
                '</div>' +
                '<div class="team-info">' +
                    '<h3 class="team-name">' + esc(member.name) + '</h3>' +
                    '<p class="team-role">' + esc(member.role) + '</p>' +
                '</div>' +
                '<div class="team-expertise">' + tagsHtml + '</div>' +
            '</div>' +
        '</div>';
    }

    /* ============================================
       UPDATE TRUST STATS
       ============================================ */
    function updateTrustCount(count) {
        var counters = document.querySelectorAll('#page-clients .trust-stat .counter');
        if (counters.length > 0) {
            counters[0].setAttribute('data-count', count);
            counters[0].textContent = count;
        }
    }

    /* ============================================
       ESCAPE HTML
       ============================================ */
    function esc(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

})();