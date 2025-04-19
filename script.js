$(document).ready(function(){
    // Show first section by default
    $(".section").first().show();
    $(".menu-link").first().addClass("active");
    
    // Menu link click handler
    $(".menu-link").click(function(e){
        e.preventDefault();
        var target = $(this).data("target");
        $(".section").hide();
        $("#" + target).show();
        
        // Add active class to clicked link
        $(".menu-link").removeClass("active");
        $(this).addClass("active");
        
        // Scroll to top of section
        $('html, body').animate({
            scrollTop: $("#" + target).offset().top - 100
        }, 500);
        
        // Close sidebar on mobile
        if ($(window).width() < 768) {
            $("#sidebar").removeClass("show");
        }
    });

    // Toggle solutions
    $(".solution-toggle").click(function(){
        $(this).next(".solution").slideToggle();
    });
    
    // Search functionality
    $("#searchInput").on("input", function(){
        var query = $(this).val().trim().toLowerCase();
        if (query.length === 0) {
            $("#searchResults").hide().empty();
            return;
        }
        
        var results = [];
        
        // Search in menu items
        $(".menu-link").each(function(){
            var text = $(this).text().toLowerCase();
            if (text.includes(query)) {
                results.push({
                    title: $(this).text(),
                    target: $(this).data("target"),
                    type: "Мавзӯъ"
                });
            }
        });
        
        // Search in section content
        $(".section").each(function(){
            var sectionId = $(this).attr("id");
            var sectionTitle = $("#" + sectionId + " h2").text();
            var sectionText = $(this).text().toLowerCase();
            
            if (sectionText.includes(query)) {
                // Find matching paragraphs
                var paragraphs = $(this).find("p, .formula, h3, h4").filter(function(){
                    return $(this).text().toLowerCase().includes(query);
                });
                
                paragraphs.each(function(){
                    var excerpt = $(this).text();
                    if (excerpt.length > 100) {
                        excerpt = excerpt.substring(0, 100) + "...";
                    }
                    
                    results.push({
                        title: sectionTitle,
                        excerpt: excerpt,
                        target: sectionId,
                        type: "Матн"
                    });
                });
            }
        });
        
        // Display results
        var resultsHtml = "";
        if (results.length > 0) {
            results.slice(0, 10).forEach(function(result){
                resultsHtml += `
                    <div class="search-result-item" data-target="${result.target}">
                        <h4>${result.title} <small>(${result.type})</small></h4>
                        ${result.excerpt ? `<p>${highlightText(result.excerpt, query)}</p>` : ''}
                    </div>
                `;
            });
        } else {
            resultsHtml = `<div class="search-result-item no-results">Натиҷае ёфт нашуд</div>`;
        }
        
        $("#searchResults").html(resultsHtml).show();
        
        // Highlight text in search results
        function highlightText(text, query) {
            return text.replace(new RegExp(query, "gi"), match => `<span class="highlight">${match}</span>`);
        }
    });
    
    // Handle click on search result
    $(document).on("click", ".search-result-item", function(){
        var target = $(this).data("target");
        if (target) {
            $(".section").hide();
            $("#" + target).show();
            $('html, body').animate({
                scrollTop: $("#" + target).offset().top - 100
            }, 500);
            
            // Update active menu item
            $(".menu-link").removeClass("active");
            $(`.menu-link[data-target="${target}"]`).addClass("active");
            
            $("#searchResults").hide();
            $("#searchInput").val("");
        }
    });
    
    // Close search results when clicking outside
    $(document).click(function(e){
        if (!$(e.target).closest("#searchContainer").length) {
            $("#searchResults").hide();
        }
    });
    
    // Toggle sidebar on mobile
    $("#menuToggle").click(function(){
        $("#sidebar").toggleClass("show");
    });
    
    // Highlight search terms in content when coming from search
    var urlParams = new URLSearchParams(window.location.search);
    var searchTerm = urlParams.get('search');
    if (searchTerm) {
        $("#searchInput").val(searchTerm);
        highlightContent(searchTerm);
    }
    
    function highlightContent(term) {
        $(".section").each(function(){
            var text = $(this).html();
            var highlighted = text.replace(new RegExp(term, "gi"), match => `<span class="highlight">${match}</span>`);
            $(this).html(highlighted);
        });
    }
});