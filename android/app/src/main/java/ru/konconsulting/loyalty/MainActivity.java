package ru.konconsulting.loyalty;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.conloyalty.vkid.VkIdPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Регистрация VK ID плагина
        registerPlugin(VkIdPlugin.class);
    }
}
