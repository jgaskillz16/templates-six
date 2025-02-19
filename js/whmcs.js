/**
 * Javascript functions utilised by the client area templates.
 *
 * @file WHMCS Six Theme Javascript Library
 * @copyright Copyright 2015 WHMCS Limited
 */

jQuery(document).ready(function() {

    // Language chooser popover
    jQuery('#languageChooser').popover({
        container: 'body',
        placement: 'bottom',
        template: '<div class="popover language-popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
        html: true,
        content: function() {
            return jQuery("#languageChooserContent").html();
        },
    });

    // Login or register popover
    jQuery('#loginOrRegister').popover({
        container: 'body',
        placement: 'bottom',
        template: '<div class="popover login-popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
        html: true,
        content: function() {
            return jQuery("#loginOrRegisterContent").html();
        },
    });

    // Account notifications popover
    jQuery("#accountNotifications").popover({
        container: 'body',
        placement: 'bottom',
        template: '<div class="popover popover-user-notifications" role="tooltip"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>',
        html: true,
        content: function() {
            return jQuery("#accountNotificationsContent").html();
        },
    });

    jQuery('.panel-sidebar .truncate').each(function () {
        jQuery(this).attr('title', jQuery(this).text())
            .attr('data-toggle', 'tooltip')
            .attr('data-placement', 'bottom');
    });

    // Default catch for all other popovers
    jQuery('[data-toggle="popover"]').popover({
        html: true
    });

    // Enable tooltips
    // Attach function to body so tooltips inserted by ajax will load
    jQuery(function(jQuery){
        jQuery('body').tooltip({
            selector: '[data-toggle="tooltip"]'
        });
    });

    // Logic to dismiss popovers on click outside
    jQuery('body').on('click', function (e) {
        jQuery('[data-toggle="popover"]').each(function () {
            if (!jQuery(this).is(e.target) && jQuery(this).has(e.target).length === 0 && jQuery('.popover').has(e.target).length === 0) {
                jQuery(this).popover('hide');
            }
        });
    });

    // Sidebar active class toggle
    jQuery(".list-group-tab-nav a").click(function() {
        if (jQuery(this).hasClass('disabled')) {
            return false;
        }
        jQuery(".list-group-tab-nav a").removeClass('active');
        jQuery(this).addClass('active');
        var urlFragment = this.href.split('#')[1];
        if (urlFragment) {
            // set the fragment in the URL bar for bookmarking and such.
            window.location.hash = '#' + urlFragment;
        }
    });

    // Sidebar minimise/maximise
    jQuery('.panel-minimise').click(function(e) {
        e.preventDefault();
        if (jQuery(this).hasClass('minimised')) {
            jQuery(this).parents('.panel').find('.panel-body, .list-group').slideDown();
            jQuery(this).removeClass('minimised');
        } else {
            jQuery(this).parents('.panel').find('.panel-body, .list-group').slideUp();
            jQuery(this).addClass('minimised');
        }
    });

    // Minimise sidebar panels by default on small devices
    if (jQuery('.container').width() <= 720) {
        jQuery('.panel-sidebar').find('.panel-body, .list-group').hide();
        jQuery('.panel-sidebar').find('.panel-minimise').addClass('minimised');
    }

    // Internal page tab selection handling via location hash
    if (jQuery(location).attr('hash').substr(1) != "") {
        var activeTab = jQuery(location).attr('hash');
        jQuery(".tab-pane").removeClass('active');
        jQuery(activeTab).removeClass('fade').addClass('active');
        jQuery(".list-group-tab-nav a").removeClass('active');
        jQuery('a[href="' + activeTab + '"]').addClass('active');
        setTimeout(function() {
            // Browsers automatically scroll on page load with a fragment.
            // This scrolls back to the top right after page complete, but
            // just before render (no perceptible scroll).
            window.scrollTo(0, 0);
        }, 1);
    }

    // Enable Switches for Checkboxes
    if (jQuery.prototype.bootstrapSwitch) {
        jQuery(".toggle-switch-success").bootstrapSwitch({
            onColor: 'success'
        });
    }

    // Collapsable Panels
    jQuery(".panel-collapsable .panel-heading").click(function(e) {
        var $this = jQuery(this);
        if (!$this.parents('.panel').hasClass('panel-collapsed')) {
            $this.parents('.panel').addClass('panel-collapsed').find('.panel-body').slideUp();
            $this.find('.collapse-icon i').removeClass('fa-minus').addClass('fa-plus');
        } else {
            $this.parents('.panel').removeClass('panel-collapsed').find('.panel-body').slideDown();
            $this.find('.collapse-icon i').removeClass('fa-plus').addClass('fa-minus');
        }
    });

    // Two-Factor Authentication Auto Focus Rules
    if (("#frmLogin").length > 0) {
        jQuery("#frmLogin input:text:visible:first").focus();
    }
    if (("#twofaactivation").length > 0) {
        jQuery("#twofaactivation input:text:visible:first,#twofaactivation input:password:visible:first").focus();
    }

    // Sub-Account Activation Toggle
    jQuery("#inputSubaccountActivate").click(function () {
        if (jQuery("#inputSubaccountActivate:checked").val() != null) {
            jQuery("#subacct-container").removeClass('hidden');
        } else {
            jQuery("#subacct-container").addClass('hidden');
        }
    });

    // Mass Domain Management Bulk Action Handling
    jQuery(".setBulkAction").click(function(event) {
        event.preventDefault();
        var id = jQuery(this).attr('id').replace('Link', ''),
            domainForm = jQuery('#domainForm');

        if (id === 'renewDomains') {
            domainForm.attr('action', WHMCS.utils.getRouteUrl('/cart/domain/renew'));
        } else {
            if (jQuery('#' + id).length !== 0) {
                var action = domainForm.attr('action');
                domainForm.attr('action', action + '#' + id);
            }
            jQuery('#bulkaction').val(id);
        }
        domainForm.submit();
    });

    // Stop events on objects with this class from bubbling up the dom
    jQuery('.stopEventBubble').click( function(event) {
        event.stopPropagation();
    });

    // Tab Control Link handling for tab switching via regular links
    jQuery('.tabControlLink').on(
        'click',
        function(event) {
            event.preventDefault();
            var id = jQuery(this).attr('href');
            jQuery("a[href='/"+id+"']").click();
        }
    );

    // Ticket Rating Click Handler
    jQuery('.ticket-reply .rating span.star').click( function(event) {
        window.location = 'viewticket.php?tid='
            + jQuery(this).parent('.rating').attr("ticketid")
            + '&c=' + jQuery(this).parent('.rating').attr("ticketkey")
            + '&rating=rate' + jQuery(this).parent('.rating').attr("ticketreplyid")
            + '_' + jQuery(this).attr("rate");
    });

    // Prevent malicious window.opener activity from auto-linked URLs
    jQuery('a.autoLinked').click(function (e) {
        e.preventDefault();

        var child = window.open();
        child.opener = null;
        child.location = e.target.href;
    });

    // Handle Single Sign-On Toggle Setting
    jQuery("#inputAllowSso").on('switchChange.bootstrapSwitch', function(event, isChecked) {
        if (isChecked) {
            jQuery("#ssoStatusTextEnabled").removeClass('hidden').show();
            jQuery("#ssoStatusTextDisabled").hide();
        } else {
            jQuery("#ssoStatusTextDisabled").removeClass('hidden').show();
            jQuery("#ssoStatusTextEnabled").hide();
        }
        WHMCS.http.jqClient.post("clientarea.php", jQuery("#frmSingleSignOn").serialize());
    });

    // Single Sign-On call for Product/Service
    jQuery('.btn-service-sso').on('click', function(e) {
        e.preventDefault();
        var button = jQuery(this);

        var form = button.parents('form');

        if (form.length == 0) {
            form = button.find('form');
        }
        if (form.hasClass('disabled')) {
            return;
        }

        button.find('.loading').removeClass('hidden').show().end()
            .attr('disabled', 'disabled');
        WHMCS.http.jqClient.post(
            window.location.href,
            form.serialize(),
            function (data) {
                button.find('.loading').hide().end().removeAttr('disabled');
                form.find('.login-feedback').html('');
                if (data.error) {
                    form.find('.login-feedback').html(data.error);
                }
                if (data.redirect !== undefined && data.redirect.substr(0, 7) === 'window|') {
                    window.open(data.redirect.substr(7), '_blank');
                }
            },
            'json'
        );
    });
    jQuery('.btn-sidebar-form-submit').on('click', function(e) {
        e.preventDefault();
        jQuery(this).find('.loading').removeClass('hidden').show().end()
            .attr('disabled', 'disabled');

        var form = jQuery(this).parents('form');

        if (form.length == 0) {
            form = jQuery(this).find('form');
        }

        if (form.length !== 0 && form.hasClass('disabled') === false) {
            form.submit();
        } else {
            jQuery(this).find('.loading').hide().end().removeAttr('disabled');
        }
    });

    // Email verification close
    jQuery('.email-verification .btn.close').click(function(e) {
        e.preventDefault();
        WHMCS.http.jqClient.post('clientarea.php', 'action=dismiss-email-banner&token=' + csrfToken);
        jQuery('.email-verification').hide();
    });

    // Back to top animated scroll
    jQuery('.back-to-top').click(function(e) {
        e.preventDefault();
        jQuery('body,html').animate({scrollTop: 0}, 500);
    });

    // Prevent page scroll on language choose click
    jQuery('.choose-language').click(function(e) {
        e.preventDefault();
    });

    // Activate copy to clipboard functionality
    jQuery('.copy-to-clipboard').click(WHMCS.ui.clipboard.copy);

    // Password Generator
    jQuery('.generate-password').click(function(e) {
        jQuery('#frmGeneratePassword').submit();
        jQuery('#modalGeneratePassword')
            .data('targetfields', jQuery(this).data('targetfields'))
            .modal('show');
    });
    jQuery('#frmGeneratePassword').submit(function(e) {
        e.preventDefault();
        var length = parseInt(jQuery('#inputGeneratePasswordLength').val(), 10);

        // Check length
        if (length < 8 || length > 64) {
            jQuery('#generatePasswordLengthError').removeClass('hidden').show();
            return;
        }

        jQuery('#inputGeneratePasswordOutput').val(WHMCS.utils.generatePassword(length));
    });
    jQuery('#btnGeneratePasswordInsert')
        .click(WHMCS.ui.clipboard.copy)
        .click(function(e) {
            jQuery(this).closest('.modal').modal('hide');
            var targetFields = jQuery(this).closest('.modal').data('targetfields');
            targetFields = targetFields.split(',');
            for(var i = 0; i < targetFields.length; i++) {
                jQuery('#' + targetFields[i]).val(jQuery('#inputGeneratePasswordOutput').val())
                    .trigger('keyup');
            }
        });

    /**
     * Code will loop through each element that has the class markdown-editor and
     * enable the Markdown editor.
     */
    var count = 0,
        editorName = 'clientMDE',
        counter = 0;
    jQuery(".markdown-editor").each(function( index ) {
        count++;
        var autoSaveName = jQuery(this).data('auto-save-name'),
            footerId = jQuery(this).attr('id') + '-footer';
        if (typeof autoSaveName == "undefined") {
            autoSaveName = 'client_area';
        }
        window[editorName + count.toString()] = jQuery(this).markdown(
        {
            footer: '<div id="' + footerId + '" class="markdown-editor-status"></div>',
            autofocus: false,
            savable: false,
            resize: 'vertical',
            iconlibrary: 'glyph',
            language: locale,
            onShow: function(e){
                var content = '',
                    save_enabled = false;
                if(typeof(Storage) !== "undefined") {
                    // Code for localStorage/sessionStorage.
                    content = localStorage.getItem(autoSaveName);
                    save_enabled = true;
                    if (content && typeof(content) !== "undefined") {
                        e.setContent(content);
                    }
                }
                jQuery("#" + footerId).html(parseMdeFooter(content, save_enabled, saved));
            },
            onChange: function(e){
                var content = e.getContent(),
                    save_enabled = false;
                if(typeof(Storage) !== "undefined") {
                    counter = 3;
                    save_enabled = true;
                    localStorage.setItem(autoSaveName, content);
                    doCountdown();
                }
                jQuery("#" + footerId).html(parseMdeFooter(content, save_enabled));
            },
            onPreview: function(e){
                var originalContent = e.getContent(),
                    parsedContent;

                jQuery.ajax({
                    url: 'clientarea.php',
                    async: false,
                    data: {token: csrfToken, action: 'parseMarkdown', content: originalContent},
                    dataType: 'json',
                    success: function (data) {
                        parsedContent = data;
                    }
                });

                return parsedContent.body ? parsedContent.body : '';
            },
            additionalButtons: [
                [{
                    name: "groupCustom",
                    data: [{
                        name: "cmdHelp",
                        title: "Help",
                        hotkey: "Ctrl+F1",
                        btnClass: "btn open-modal",
                        icon: {
                            glyph: 'fas fa-question-circle',
                            fa: 'fa fa-question-circle',
                            'fa-3': 'icon-question-sign'
                        },
                        callback: function(e) {
                            e.$editor.removeClass("md-fullscreen-mode");
                        }
                    }]
                }]
            ],
            hiddenButtons: [
                'cmdImage'
            ]
        });

        jQuery('button[data-handler="bootstrap-markdown-cmdHelp"]')
            .attr('data-modal-title', markdownGuide)
            .attr('href', 'submitticket.php?action=markdown');

        jQuery(this).closest("form").bind({
            submit: function() {
                if(typeof(Storage) !== "undefined") {
                    localStorage.removeItem(autoSaveName);
                }
            }
        });
    });

    // Email verification
    jQuery('#btnResendVerificationEmail').click(function() {
        WHMCS.http.jqClient.post('clientarea.php',
            {
                'token': csrfToken,
                'action': 'resendVerificationEmail'
            }).done(function(data) {
                jQuery('#btnResendVerificationEmail').html('Email Sent').prop('disabled', true);
            });
    });

    /**
     * Parse the content to populate the markdown editor footer.
     *
     * @param {string} content
     * @param {bool} auto_save
     * @param {string} [saveText]
     * @returns {string}
     */
    function parseMdeFooter(content, auto_save, saveText)
    {
        saveText = saveText || saving;
        var pattern = /[^\s]+/g,
            m = [],
            word_count = 0,
            line_count = 0;
        if (content) {
            m = content.match(pattern);
            line_count = content.split(/\\r\\n|\\r|\\n/).length;
        }
        if (m) {
            for (var i = 0; i < m.length; i++) {
                if (m[i].charCodeAt(0) >= 0x4E00) {
                    word_count += m[i].length;
                } else {
                    word_count += 1;
                }
            }
        }
        return '<div class="small-font">lines: ' + line_count
            + '&nbsp;&nbsp;&nbsp;words: ' + word_count + ''
            + (auto_save ? '&nbsp;&nbsp;&nbsp;<span class="markdown-save">' + saveText + '</span>' : '')
            + '</div>';
    }

    /**
     * Countdown the save timeout. When zero, the span will update to show saved.
     */
    function doCountdown()
    {
        if (counter >= 0) {
            if (counter == 0) {
                jQuery("span.markdown-save").html(saved);
            }
            counter--;
            setTimeout(doCountdown, 1000);
        }
    }

    // Two-Factor Activation Process Modal Handler.
    var frmTwoFactorActivation = jQuery('input[name=2fasetup]').parent('form');
    frmTwoFactorActivation.submit(function(e) {
        e.preventDefault();
        openModal(frmTwoFactorActivation.attr('action'), frmTwoFactorActivation.serialize(), 'Loading...');
    });

    jQuery.fn.showInputError = function () {
        this.parents('.form-group').addClass('has-error').find('.field-error-msg').show();
        return this;
    };

    jQuery('#frmPayment').on('submit', function() {
        var btn = jQuery('#btnSubmit');
            btn.find('span').toggleClass('hidden');
            btn.prop('disabled', true).addClass('disabled');
    });

    // SSL Manage Action Button.
    jQuery('.btn-resend-approver-email').click(function () {
        WHMCS.http.jqClient.post(
            jQuery(this).data('url'),
            {
                addonId: jQuery(this).data('addonid'),
                serviceId: jQuery(this).data('serviceid'),
            },
            function(data) {
                if (data.success == true) {
                    jQuery('.alert-table-ssl-manage').addClass('alert-success').text('Approver Email Resent').removeClass('hidden');
                } else {
                    jQuery('.alert-table-ssl-manage').addClass('alert-danger').text('Error: ' + data.message).removeClass('hidden');
                }
            }
        );
    });

    // Domain Pricing Table Filters
    jQuery(".tld-filters a").click(function(e) {
        e.preventDefault();

        if (jQuery(this).hasClass('label-success')) {
            jQuery(this).removeClass('label-success');
        } else {
            jQuery(this).addClass('label-success');
        }

        jQuery('.tld-row').removeClass('filtered-row');
        jQuery('.tld-filters a.label-success').each(function(index) {
            var filterValue = jQuery(this).data('category');
            jQuery('.tld-row[data-category*="' + filterValue + '"]').addClass('filtered-row');
        });
        jQuery(".filtered-row:even").removeClass('highlighted');
        jQuery(".filtered-row:odd").addClass('highlighted');
        jQuery('.tld-row:not(".filtered-row")').fadeOut('', function() {
            if (jQuery('.filtered-row').size() === 0) {
                jQuery('.tld-row.no-tlds').show();
            } else {
                jQuery('.tld-row.no-tlds').hide();
            }
        });
        jQuery('.tld-row.filtered-row').fadeIn();
    });
    jQuery(".filtered-row:even").removeClass('highlighted');
    jQuery(".filtered-row:odd").addClass('highlighted');

    // DataTable data-driven auto object registration
    WHMCS.ui.dataTable.register();

    // Bootstrap Confirmation popup auto object registration
    WHMCS.ui.confirmation.register();

    WHMCS.ui.jsonForm.initAll();

    jQuery('#frmReply').submit(function(e) {
        jQuery('#frmReply').find('input[type="submit"]').addClass('disabled').prop('disabled', true);
    });

    jQuery('#frmDomainContactModification').on('submit', function(){
        if (!allowSubmit) {
            var changed = false;
            jQuery('.irtp-field').each(function() {
                var value = jQuery(this).val(),
                    originalValue = jQuery(this).data('original-value');
                if (value !== originalValue) {
                    changed = true;
                }
            });
            if (changed) {
                jQuery('#modalIRTPConfirmation').modal('show');
                return false;
            }
        }
        return true;
    });

    jQuery('.ssl-state.ssl-sync').each(function () {
        var self = jQuery(this);
        WHMCS.http.jqClient.post(
            WHMCS.utils.getRouteUrl('/domain/ssl-check'),
            {
                'type': self.parent('td').data('type'),
                'domain': self.parent('td').data('domain'),
                'token': csrfToken
            },
            function (data) {
                if (data.invalid) {
                    self.hide();
                } else {
                    self.replaceWith(
                        '<img src="' + data.image + '" data-toggle="tooltip" title="' + data.tooltip + '" class="' + data.class + '">'
                    );
                }
            }
        );
    });
    jQuery(document).on('click', '.ssl-state.ssl-inactive', function(e) {
        e.preventDefault();
        window.location.href = WHMCS.utils.getRouteUrl('/ssl-purchase');
    });

    WHMCS.recaptcha.register();

    var dynamicRecaptchaContainer = jQuery('#divDynamicRecaptcha');
    var homepageHasRecaptcha = jQuery(dynamicRecaptchaContainer).length > 0;
    var homepageHasInvisibleRecaptcha = homepageHasRecaptcha && jQuery(dynamicRecaptchaContainer).data('size') === 'invisible';

    if (homepageHasRecaptcha && !homepageHasInvisibleRecaptcha) {
        jQuery('section#home-banner').addClass('with-recaptcha');
    }

    if (jQuery('.domainchecker-homepage-captcha').length && !homepageHasInvisibleRecaptcha) {
        // invisible reCaptcha doesn't play well with onsubmit() handlers on all submissions following a prevented one

        jQuery('#frmDomainHomepage').submit(function (e) {
            var frmDomain = jQuery('#frmDomainHomepage'),
                inputDomain = jQuery(frmDomain).find('input[name="domain"]'),
                reCaptchaContainer = jQuery('#divDynamicRecaptcha'),
                reCaptcha = jQuery('#g-recaptcha-response'),
                captcha = jQuery('#inputCaptcha');

            if (reCaptcha.length && !reCaptcha.val()) {
                reCaptchaContainer.tooltip('show');

                e.preventDefault();
                return;
            }

            if (captcha.length && !captcha.val()) {
                captcha.tooltip('show');

                e.preventDefault();
                return;
            }
        });
    }

    $('.icheck-button').iCheck({
        inheritID: true,
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%'
    });

    jQuery('#inputNoStore').on('switchChange.bootstrapSwitch', function(event, state) {
        var descContainer = jQuery('#inputDescription');
        if (!state) {
            descContainer.prop('disabled', true).addClass('disabled');
        }
        if (state) {
            descContainer.removeClass('disabled').prop('disabled', false);
        }
    });
});

/**
 * Check all checkboxes with a given class.
 *
 * @param {string} className         Common class name.
 * @param {domElement} masterControl Parent checkbox to which the other checkboxes should mirror.
 */
function checkAll(className, masterControl) {
    if (className[0] != '.') {
        className = '.' + className;
    }
    // In jQuery, if you set the checked attribute directly, the dom
    // element is changed, but browsers don't show the check box as
    // checked.  Using the click event will properly display.
    jQuery(className).removeAttr('checked');
    if(jQuery(masterControl).is(":checked")) {
        jQuery(className).click();
    }
}

/**
 * Redirect on click if an element is not a button or link.
 *
 * Where table rows are clickable, we only want to redirect if the row
 * itself is clicked. If a button or link within the row is clicked,
 * the event tied to that object should be executed. This function
 * stops the standard JS event bubbling required to make that happen.
 *
 * @param {object} clickEvent jQuery click event
 * @param {string} target     Redirect location
 * @param {bool} newWindow    Open link in new window
 */
function clickableSafeRedirect(clickEvent, target, newWindow) {
    var eventSource = clickEvent.target.tagName.toLowerCase();
    var eventParent = clickEvent.target.parentNode.tagName.toLowerCase();
    var eventTable = clickEvent.target.parentNode.parentNode.parentNode;
    if (jQuery(eventTable).hasClass('collapsed')) {
        // This is a mobile device sized display, and datatables has triggered folding
        return false;
    }
    if (eventSource === 'i' && jQuery(clickEvent.target).hasClass('ssl-required')) {
        return false;
    }
    if(eventSource != 'button' && eventSource != 'a') {
        if(eventParent != 'button' && eventParent != 'a') {
            if (newWindow) {
                window.open(target);
            } else {
                window.location.href = target;
            }
        }
    }
}

/**
 * Open a centered popup window.
 *
 * @param {string} addr     The URL to navigate to
 * @param {string} popname  The name to assign the window
 * @param {number} w        The width
 * @param {number} h        The height
 * @param {string} features Any additional settings to apply
 */
function popupWindow(addr, popname, w, h, features) {
    var winl = (screen.width-w) / 2;
    var wint = (screen.height-h) / 2;
    if (winl < 0) winl = 0;
    if (wint < 0) wint = 0;
    var settings = 'height=' + h + ',';
    settings += 'width=' + w + ',';
    settings += 'top=' + wint + ',';
    settings += 'left=' + winl + ',';
    settings += features;
    win = window.open(addr, popname, settings);
    win.window.focus();
}

/**
 * Add domain renewal to shopping cart.
 *
 * @param {number} renewalID    The domain ID to be added
 * @param {domElement} selfThis The object triggering the add
 */
function addRenewalToCart(renewalID, selfThis) {
    jQuery("#domainRow" + renewalID).attr('disabled', 'disabled');
    jQuery("#domainRow" + renewalID).find("select,button").attr("disabled", "disabled");
    jQuery(selfThis).html('<span class="glyphicon glyphicon-shopping-cart"></span> Adding...');
    var renewalPeriod = jQuery("#renewalPeriod" + renewalID).val();
    WHMCS.http.jqClient.post(
        "clientarea.php",
        "addRenewalToCart=1&token=" + csrfToken + "&renewID="+ renewalID + "&period=" + renewalPeriod,
        function( data ) {
            jQuery("#cartItemCount").html(((jQuery("#cartItemCount").html() * 1) + 1));
            jQuery(selfThis).html('<span class="glyphicon glyphicon-shopping-cart"></span> Added');
            jQuery("#btnCheckout").fadeIn();
        }
    );
}

/**
 * Navigate to a page on dropdown change.
 *
 * This is implemented onblur() for a dropdown.  When the dropdown
 * changes state, the value is pulled and the browser navigated to
 * the selected page.
 *
 * @param {domElement} select The dropdown triggering the event
 */
function selectChangeNavigate(select) {
    window.location.href = $(select).val();
}

/**
 * Append additional file upload input field.
 */
function extraTicketAttachment() {
    jQuery("#fileUploadsContainer").append('<input type="file" name="attachments[]" class="form-control" />');
}

/**
 * Fetch load and uptime for a given server.
 *
 * @param {number} num Server Id
 */
function getStats(num) {
    WHMCS.http.jqClient.post('serverstatus.php', 'getstats=1&num=' + num, function(data) {
        jQuery("#load"+num).html(data.load);
        jQuery("#uptime"+num).html(data.uptime);
    },'json');
}

/**
 * Determine status of a given port for a given server.
 *
 * @param {number} num  Server Id
 * @param {number} port Port Number
 */
function checkPort(num, port) {
    WHMCS.http.jqClient.post('serverstatus.php', 'ping=1&num=' + num + '&port=' + port, function(data) {
        jQuery("#port" + port + "_" + num).html(data);
    });
}

/**
 * Fetch automated knowledgebase suggestions for ticket content.
 */
function getticketsuggestions() {
    currentcheckcontent = jQuery("#message").val();
    if (currentcheckcontent != lastcheckcontent && currentcheckcontent != "") {
        WHMCS.http.jqClient.post("submitticket.php", { action: "getkbarticles", text: currentcheckcontent },
            function(data){
            if (data) {
                jQuery("#searchresults").html(data);
                jQuery("#searchresults").hide().removeClass('hidden').slideDown();
            }
        });
        lastcheckcontent = currentcheckcontent;
    }
    setTimeout('getticketsuggestions();', 3000);
}

/**
 * Update custom fields upon department change.
 *
 * @param {domElement} input The department selector dropdown object
 */
function refreshCustomFields(input) {
    jQuery("#customFieldsContainer").load(
        "submitticket.php",
        { action: "getcustomfields", deptid: $(input).val() }
    );
}

/**
 * Submit the first form that exists within a given container.
 *
 * @param {string} containerId The ID name of the container
 */
function autoSubmitFormByContainer(containerId) {
    if (typeof noAutoSubmit === "undefined" || noAutoSubmit === false) {
        jQuery("#" + containerId).find("form:first").submit();
    }
}

/**
 * Submit default whois info and disable custom fields.
 *
 * @param {string} regType The contact registration type
 */
function useDefaultWhois(regType) {
    jQuery("." + regType.substr(0, regType.length - 1) + "customwhois").attr("disabled", true);
    jQuery("." + regType.substr(0, regType.length - 1) + "defaultwhois").attr("disabled", false);
    jQuery('#' + regType.substr(0, regType.length - 1) + '1').attr("checked", "checked");
}

/**
 * Submit custom fields and disable default whois info.
 *
 * @param {string} regType The contact registration type
 */
function useCustomWhois(regType) {
    jQuery("." + regType.substr(0, regType.length - 1) + "customwhois").attr("disabled", false);
    jQuery("." + regType.substr(0, regType.length - 1) + "defaultwhois").attr("disabled", true);
    jQuery('#' + regType.substr(0, regType.length - 1) + '2').attr("checked", "checked");
}

function showNewBillingAddressFields() {
    jQuery('#newBillingAddress').slideDown();
}

function hideNewBillingAddressFields() {
    jQuery('#newBillingAddress').slideUp();
}

/**
 * Show new credit card input fields.
 */
function showNewCardInputFields() {
    if (jQuery(".cc-details").hasClass("hidden")) {
        jQuery(".cc-details").hide().removeClass("hidden");
    }
    jQuery(".cc-details").slideDown();

    jQuery("#billingAddressChoice")
        .slideDown()
        .find('input[name="billingcontact"]')
        .first()
        .iCheck('check');
}

/**
 * Hide new credit card input fields.
 */
function hideNewCardInputFields() {
    hideNewBillingAddressFields();

    jQuery(".cc-details").slideUp();
    jQuery("#billingAddressChoice").slideUp();

    var selectedCcInfo = jQuery('input[name="ccinfo"]:checked');

    var selectedCcBillingContactId = jQuery(selectedCcInfo).data('billing-contact-id');

    var selectedBillingContactData = jQuery('.billing-contact-info[data-billing-contact-id="' + selectedCcBillingContactId + '"]');

    if (selectedBillingContactData.length) {
        jQuery('.billing-contact-info').hide();
        jQuery(selectedBillingContactData).show();
    }
}

function showRemoteInputForm() {
    var remoteInputForm = jQuery('#remoteInput'),
        paymentGateway = remoteInputForm.data('payment-module'),
        errorDiv = jQuery('#remoteInputError'),
        btnSubmitContainer = jQuery('#btnSubmitContainer');
    if (btnSubmitContainer.is(':visible')) {
        btnSubmitContainer.slideUp('fast');
    }
    if (remoteInputForm.not(':visible')) {
        remoteInputForm.html(
            jQuery('#remoteInputLoading').html()
        )
            .hide()
            .removeClass('hidden')
            .slideDown('fast', function() {
                var invoiceId = jQuery('input[name="invoiceid"]').val();
                WHMCS.http.jqClient.jsonPost({
                    url: WHMCS.utils.getRouteUrl('/account/paymentmethods/remote-input'),
                    data: 'gateway=' + paymentGateway + '&invoice_id=' + invoiceId + '&token=' + csrfToken,
                    success: function(response) {
                        remoteInputForm.slideUp('fast').html(response.output).slideDown('fast');
                    },
                    warning: function(error) {
                        errorDiv.find('div').html(error);
                        remoteInputForm.slideUp('fast').html(errorDiv.html()).slideDown('fast');
                    },
                    fail: function(error) {
                        errorDiv.find('div').html(error);
                        remoteInputForm.slideUp('fast').html(errorDiv.html()).slideDown('fast');
                    }
                });
            });
    }
}

function hideRemoteInputForm() {
    var remoteInputForm = jQuery('#remoteInput'),
        btnSubmitContainer = jQuery('#btnSubmitContainer');
    if (remoteInputForm.is(':visible')) {
        remoteInputForm.slideUp('fast').html('').addClass('hidden');
    }
    if (btnSubmitContainer.not(':visible')) {
        btnSubmitContainer.slideDown('fast');
    }
}

/**
 * Get automatic knowledgebase suggestions for support ticket message.
 */
var lastTicketMsg;
function getTicketSuggestions() {
    var userMsg = jQuery("#inputMessage").val();
    if (userMsg != lastTicketMsg && userMsg != '') {
        WHMCS.http.jqClient.post("submitticket.php", { action: "getkbarticles", text: userMsg },
            function (data) {
                if (data) {
                    jQuery("#autoAnswerSuggestions").html(data);
                    if (!jQuery("#autoAnswerSuggestions").is(":visible")) {
                        jQuery("#autoAnswerSuggestions").hide().removeClass('hidden').slideDown();
                    }
                }
            });
        lastTicketMsg = userMsg;
    }
    setTimeout('getTicketSuggestions()', 3000);
}

/**
 * Smooth scroll to named element.
 */
function smoothScroll(element) {
    $('html, body').animate({
        scrollTop: $(element).offset().top
    }, 500);
}

function irtpSubmit()
{
    allowSubmit = true;
    var optOut = 0,
        optOutCheckbox = jQuery('#modalIrtpOptOut'),
        optOutReason = jQuery('#modalReason'),
        formOptOut = jQuery('#irtpOptOut'),
        formOptOutReason = jQuery('#irtpOptOutReason');

    if (optOutCheckbox.is(':checked')) {
        optOut = 1;
    }
    formOptOut.val(optOut);
    formOptOutReason.val(optOutReason.val());
    jQuery('#frmDomainContactModification').submit();
}
