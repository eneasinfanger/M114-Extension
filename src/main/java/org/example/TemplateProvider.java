package org.example;

import com.sun.net.httpserver.HttpServer;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.InetSocketAddress;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class TemplateProvider {
    private static final Map<String, byte[]> templates = new HashMap<>();

    private static void loadTemplates(File file) {
        if (file.isDirectory()) {
            Arrays.stream(file.listFiles()).forEach(TemplateProvider::loadTemplates);
            return;
        }
        String name = file.getName();
        if (!name.endsWith(".html")) {
            return;
        }
        name = "/" + name.substring(0, name.lastIndexOf(".html"));

        try (var templateStream = new FileInputStream(file)) {
            templates.put(name, templateStream.readAllBytes());
            System.out.println("Loaded template '" + file + "'");
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    public static void main(String[] args) throws IOException {
        TemplateProvider.class.getClassLoader().resources("").forEach(url -> {
            loadTemplates(new File(url.getFile().replace("%20", " ").substring(1)));
        });

        var server = HttpServer.create(new InetSocketAddress(8080), 0);
        try {
            templates.forEach((name, content) -> {
                server.createContext(name, exchange -> {
                    exchange.sendResponseHeaders(200, content.length);
                    exchange.getResponseBody().write(content);
                });
            });

            server.start();
            new Scanner(System.in).nextLine();
        } finally {
            server.stop(0);
        }
    }
}