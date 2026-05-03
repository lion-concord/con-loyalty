package com.conloyalty.vkid;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.vk.api.sdk.VK;
import com.vk.api.sdk.auth.VKAuthenticationResult;
import com.vk.api.sdk.auth.VKScope;

import java.util.ArrayList;
import java.util.Collection;

import kotlin.Unit;

@CapacitorPlugin(name = "VkId")
public class VkIdPlugin extends Plugin {
    private static final String TAG = "VkIdPlugin";

    @PluginMethod
    public void login(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity not available");
            return;
        }

        // Запускаем VK авторизацию
        Collection<VKScope> scopes = new ArrayList<>();
        scopes.add(VKScope.EMAIL);
        scopes.add(VKScope.PHONE);

        VK.login(activity, scopes, result -> {
            if (result instanceof VKAuthenticationResult.Success) {
                VKAuthenticationResult.Success successResult = (VKAuthenticationResult.Success) result;

                try {
                    int userId = successResult.getToken().getUserId();
                    String accessToken = successResult.getToken().getAccessToken();

                    JSObject user = new JSObject();
                    user.put("id", userId);

                    JSObject response = new JSObject();
                    response.put("user", user);
                    response.put("accessToken", accessToken);

                    call.resolve(response);
                } catch (Exception e) {
                    Log.e(TAG, "Error processing VK login result", e);
                    call.reject("Failed to process login result", e);
                }

            } else if (result instanceof VKAuthenticationResult.Failed) {
                VKAuthenticationResult.Failed failedResult = (VKAuthenticationResult.Failed) result;
                call.reject("VK login failed: " + failedResult.getException().getMessage());

            } else {
                call.reject("VK login cancelled");
            }

            return Unit.INSTANCE;
        });
    }

    @PluginMethod
    public void logout(PluginCall call) {
        VK.logout();
        call.resolve();
    }

    @PluginMethod
    public void getCurrentUser(PluginCall call) {
        if (!VK.isLoggedIn()) {
            call.resolve(new JSObject().put("user", JSObject.NULL));
            return;
        }

        try {
            int userId = VK.getUserId();

            JSObject user = new JSObject();
            user.put("id", userId);

            JSObject result = new JSObject();
            result.put("user", user);
            call.resolve(result);

        } catch (Exception e) {
            Log.e(TAG, "Error getting current user", e);
            call.reject("Failed to get current user", e);
        }
    }
}
